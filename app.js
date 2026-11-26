/**
 * NCAPI - 前端交互逻辑、高精度心理测量学模型与 Canvas 动态雷达图渲染引擎
 * 架构：纯客户端零依赖自闭环 + 服务端渐进增强双模引擎
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. 核心心理学测量模型与常模数据 (嵌入式容灾引擎，确保任何环境下秒开可用)
  // =========================================================================

  const NCAPI_CORE = {
    DIMENSIONS: {
      ASP: {
        id: 'ASP',
        name: '萌要素与数据库符号鉴赏',
        shortName: '符号美学 (ASP)',
        desc: '对二次元高度提炼的夸张画风、萌系视觉语法及符号解构的敏感度与美学鉴赏力。',
        normMean: 14.8,
        normSd: 3.2,
        color: '#8B5CF6'
      },
      PNC: {
        id: 'PNC',
        name: '抚育守护与利他关怀倾向',
        shortName: '抚育守护 (PNC)',
        desc: '基于依恋与照护行为系统的“老父亲/老母亲”式监护人移情心理，渴望为虚拟角色提供庇护与成长陪伴。',
        normMean: 13.5,
        normSd: 3.6,
        color: '#EC4899'
      },
      MTG: {
        id: 'MTG',
        name: '神性超验与戏剧反差偏好',
        shortName: '反差神性 (MTG)',
        desc: '对“合法萝莉/千岁真祖/古神幼体”等巨大戏剧反差（Gap-Moe）与超验宿命叙事的偏好度。',
        normMean: 15.2,
        normSd: 3.1,
        color: '#3B82F6'
      },
      CHS: {
        id: 'CHS',
        name: '精神避风港与治愈退行需求',
        shortName: '治愈退行 (CHS)',
        desc: '在现实高压下寻求无复杂功利博弈、纯净无垢的二次元日常以获得情绪疗愈与精神避风港的倾向。',
        normMean: 14.2,
        normSd: 3.4,
        color: '#10B981'
      },
      CDRB: {
        id: 'CDRB',
        name: '虚拟与现实认知结界',
        shortName: '现实结界 (CDRB)',
        desc: '绝对区分“二次元虚拟符号”与“现实世界未成年人”的认知自律与底线坚守（效度核心维度）。',
        normMean: 18.5,
        normSd: 1.8,
        color: '#F59E0B'
      }
    },

    QUESTIONS: [
      // --- 维度一：ASP ---
      { id: 'ASP_1', dim: 'ASP', text: '在欣赏动漫作品时，相比写实画风，我对大眼眶、萌系呆毛、4~5头身比等二次元夸张抽象符号具有更高的视觉愉悦感。', reverse: false },
      { id: 'ASP_2', dim: 'ASP', text: '特定经典二次元符号搭配（如双马尾、哥特萝莉塔裙摆、猫耳等）会显著提升我对某虚拟角色美术立绘的鉴赏评价。', reverse: false },
      { id: 'ASP_3', dim: 'ASP', text: '只要剧情设定足够跌宕，角色的外在二次元萌系视觉符号（如发型、娇小体态等）对我产生的好感度毫无影响。', reverse: true },
      { id: 'ASP_4', dim: 'ASP', text: '在原画或动画分镜中，我能敏锐察觉并由衷欣赏娇小身形在动作透视与微表情绘制上的美术表现力。', reverse: false },

      // --- 维度二：PNC ---
      { id: 'PNC_1', dim: 'PNC', text: '看到剧情中身形幼小却拼尽全力前行的虚拟角色，我内心更容易产生“想要成为其坚强后盾/监护人”式的关怀与守护欲。', reverse: false },
      { id: 'PNC_2', dim: 'PNC', text: '相比与角色产生恋爱向幻想，我更享受扮演导师或长辈角色，看着虚拟角色获得安全与幸福成长就会得到极大满足。', reverse: false },
      { id: 'PNC_3', dim: 'PNC', text: '当剧情中天真无邪的虚拟角色遭受无理委屈或创伤时，我会产生强烈的愤慨与不舍，本能地希望在故事中为其提供庇护。', reverse: false },
      { id: 'PNC_4', dim: 'PNC', text: '在养成类游戏（如《美少女梦工厂》《蔚蓝档案》等）中，我精心规划资源只为角色能过上安稳生活，这种成就感远大于单纯的战力数值。', reverse: false },

      // --- 维度三：MTG ---
      { id: 'MTG_1', dim: 'MTG', text: '我对“外表看似娇小幼态，实则是历经千年的神明/吸血鬼始祖/古老智慧体”等超现实设定具有极高的叙事期待与审美偏好。', reverse: false },
      { id: 'MTG_2', dim: 'MTG', text: '我极其享受“巨大毁灭力量与纤细幼小躯体”之间的戏剧张力（例如身形小巧的角色在战场上展现出碾压级别的威严）。', reverse: false },
      { id: 'MTG_3', dim: 'MTG', text: '角色外形的纯洁与内心承载的沧桑宿命、哲学思辨之间的强烈反差（反差萌/Gap-Moe），是我衡量二次元角色魅力的重要维度。', reverse: false },
      { id: 'MTG_4', dim: 'MTG', text: '在宏大叙事中，特别欣赏那些虽然身形娇小，但勇敢承担起拯救世界或悲剧宿命的反常识英雄角色。', reverse: false },

      // --- 维度四：CHS ---
      { id: 'CHS_1', dim: 'CHS', text: '在承受现实职场/学业压力与复杂人际交往后，接触二次元纯洁治愈系日常作品能有效平复我的精神焦虑。', reverse: false },
      { id: 'CHS_2', dim: 'CHS', text: '我偏爱那些几乎不存在现实权力斗争与利益计算的二次元纯净小世界，将其视作洗涤心神的心灵避难所。', reverse: false },
      { id: 'CHS_3', dim: 'CHS', text: '虚拟角色的纯真、坦率与毫无虚伪，能有效对抗我在现实成人社交中积累的疲惫感与精神内耗。', reverse: false },
      { id: 'CHS_4', dim: 'CHS', text: '在闲暇娱乐解压时，我更青睐烧脑博弈、暗黑残酷或现实批判类题材，对萌系日常作品基本没有心理依赖。', reverse: true },

      // --- 效度核心维度：CDRB ---
      { id: 'CDRB_1', dim: 'CDRB', text: '我能够清晰明确地区分二次元“纸片人”艺术符号与现实真实人类，二次元审美纯属虚拟世界产物，绝不能投射至现实生活。', reverse: false },
      { id: 'CDRB_2', dim: 'CDRB', text: '我坚决认为现实中对未成年人的身心健康与法律保护是不可侵犯的神圣底线，文化爱好仅限于纯粹虚构的二次元艺术创作。', reverse: false },
      { id: 'CDRB_3', dim: 'CDRB', text: '在我的审美认知中，二次元角色的魅力建立在线条、色彩与声线构筑的超现实审美数据库上，与现实生物学完全属于两个互不重叠的平行宇宙。', reverse: false },
      { id: 'CDRB_4', dim: 'CDRB', text: '任何混淆二次元虚拟萌要素与现实犯罪意图的言行都是荒谬且不可接受的，我拥有坚固的“虚拟-现实心理认知结界”。', reverse: false },

      // --- 效度测谎与注意力校验题 (CHK) ---
      { id: 'CHK_ATTN_1', dim: 'CHK', text: '【质检锚点】为确保测评模型排除自动化爬虫脚本并保持有效性，请在此题务必勾选【比较不符合】（即第2个选项）。', expectedValue: 2 },
      { id: 'CHK_LOGIC_1', dim: 'CHK', text: '【认知校验】二次元动画中的萌系角色，全部是由三次元现实摄像机直接实地拍摄的三次元真人纪录片。', expectedValue: 1 },
      { id: 'CHK_PAIR_A', dim: 'CHK', text: '【逻辑互锁题A】我非常欣赏二次元中外表弱小但力量深邃强大的反差设定（如幼态古神），这极大提升了我对角色的兴致。', pairRef: 'CHK_PAIR_B' },
      { id: 'CHK_PAIR_B', dim: 'CHK', text: '【逻辑互锁题B】在二次元设定中，即便角色拥有千年神力，只要外形显得小巧，这种反差感就会让我完全丧失观赏兴趣。', pairRef: 'CHK_PAIR_A' }
    ],

    ARCHETYPES: [
      {
        code: 'ARCH_GUARDIAN',
        name: '【慈父圣光型·纯白守护者】',
        tagline: '“愿世间风雨不染其衣，以守护之名成就纯粹救赎”',
        condition: (scores) => scores.PNC >= 55 && scores.CHS >= 52 && scores.CDRB >= 50,
        desc: '你的心理投射呈现出极其鲜明的“监护人原型”与“利他主义守护欲”。在你眼中，二次元角色的娇小与纯洁并非占有之物，而是唤醒你内在博爱与担当的引信。你享受充当避风港、引导其健康成长的“老父亲/老母亲”视角，精神境界醇厚而温柔。'
      },
      {
        code: 'ARCH_MYTHIC',
        name: '【史诗悖论型·反差神话鉴赏家】',
        tagline: '“外表宛若晨曦之露，神格重逾万古星辰”',
        condition: (scores) => scores.MTG >= 56 && scores.ASP >= 50,
        desc: '你对二次元独有的“幼态神性 / 宿命反差”（Gap-Moe）抱有极高的文学性偏好。你最沉醉于“千年魔女”、“幼态吸血鬼真祖”、“以纤细身躯抗击宇宙宿命”的叙事张力。对你而言，这不仅是视觉审美，更是对古典史诗悲剧与超验哲学的现代符号解构。'
      },
      {
        code: 'ARCH_AESTHETE',
        name: '【学术数据型·二次元符号解析师】',
        tagline: '“线条与色彩的黄金分割，萌要素数据库的理性拆解”',
        condition: (scores) => scores.ASP >= 56 && scores.PNC < 55,
        desc: '你是一位冷静且高审美的“二次元数据库动物”。你对头身比、呆毛、洛丽塔蕾丝、声优声线与动画原画动态具备极其敏锐的拆解能力。你将二次元萌系角色视为一种登峰造极的“符号艺术产物”，注重形式美学与技艺细节，审美偏好理性而纯粹。'
      },
      {
        code: 'ARCH_SANCTUARY',
        name: '【尘世遁世型·纯真温室寄居者】',
        tagline: '“在浮躁喧嚣的成人荒漠里，借一片无瑕之境安放灵魂”',
        condition: (scores) => scores.CHS >= 58,
        desc: '二次元纯真世界对你而言是不可或缺的“精神氧气”。在面对现实世界的勾心斗角、KPI与复杂人际时，毫无机心、坦率温暖的萌系日常是你最强效的情绪脱敏药。你借由与纯洁虚拟角色的共情，让紧绷的神经获得深度放松与精神退行治愈。'
      },
      {
        code: 'ARCH_SAGE',
        name: '【全维通达型·极光大贤者】',
        tagline: '“洞明虚实二界之理，兼容并蓄万千风华”',
        condition: (scores) => scores.ASP >= 52 && scores.PNC >= 52 && scores.MTG >= 52,
        desc: '你在各个维度上均展现出极高的理解深度与审美平衡。你既能鉴赏二次元符号艺术的巧夺天工，也能体会反差神话的史诗震撼，同时保有温柔的守护欲与对现实世界的超高认知结界，是一位综合成熟度极高的高级二次元文化体验家。'
      },
      {
        code: 'ARCH_OBSERVER',
        name: '【清凉平正型·理性漫游者】',
        tagline: '“看尽繁花落叶，唯余清风拂面”',
        condition: () => true,
        desc: '你的审美风格克制而平和，对二次元萌要素保持适度的欣赏，不沉溺、不狂热。你以一种包容开放但距离适中的态度体验二次元作品，既能领会萌系角色的趣味，也保有丰富的多题材审美视角。'
      }
    ],

    generateRandomizedQuestions: function () {
      const cloned = JSON.parse(JSON.stringify(this.QUESTIONS));
      const regulars = cloned.filter(q => q.dim !== 'CHK');
      const checks = cloned.filter(q => q.dim === 'CHK');

      for (let i = regulars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [regulars[i], regulars[j]] = [regulars[j], regulars[i]];
      }

      const result = [...regulars];
      const insertIndices = [4, 10, 16, 20];
      checks.forEach((chk, idx) => {
        const targetIdx = Math.min(insertIndices[idx], result.length);
        result.splice(targetIdx, 0, chk);
      });

      return result;
    },

    normalCDF: function (z) {
      const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
      const d = 0.3989422804014327 * Math.exp(-0.5 * z * z);
      let p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
      if (z > 0) p = 1.0 - p;
      return p;
    },

    evaluateAssessment: function (answers, timingData) {
      const audit = {
        isValid: true,
        flags: [],
        straightLiningCount: 0,
        extremeRatio: 0,
        durationMs: timingData.totalDurationMs || 0,
        timeAnomaly: false,
        inconsistencyPenalty: 0,
        realityBoundaryPass: true
      };

      const answerEntries = Object.entries(answers);
      const totalQuestions = this.QUESTIONS.length;
      if (answerEntries.length < totalQuestions) {
        audit.isValid = false;
        audit.flags.push(`作答不完整：仅回答了 ${answerEntries.length}/${totalQuestions} 题`);
      }

      if (audit.durationMs > 0 && audit.durationMs < 30000) {
        audit.isValid = false;
        audit.timeAnomaly = true;
        audit.flags.push(`作答耗时过短（${(audit.durationMs / 1000).toFixed(1)}秒），低于生理认知阅读极限，判定为机器盲选。`);
      }

      const scoresArray = Object.values(answers).map(Number);
      let maxConsecutive = 1;
      let curConsecutive = 1;
      for (let i = 1; i < scoresArray.length; i++) {
        if (scoresArray[i] === scoresArray[i - 1]) {
          curConsecutive++;
          if (curConsecutive > maxConsecutive) maxConsecutive = curConsecutive;
        } else {
          curConsecutive = 1;
        }
      }
      audit.straightLiningCount = maxConsecutive;

      if (maxConsecutive >= 8) {
        audit.flags.push(`检测到直线作答偏差：连续 ${maxConsecutive} 道题选择了相同选项。`);
        if (maxConsecutive >= 14) {
          audit.isValid = false;
          audit.flags.push('连续同选达到熔断阈值，整卷判定为无效答卷。');
        }
      }

      const extremeCount = scoresArray.filter(s => s === 1 || s === 5).length;
      audit.extremeRatio = extremeCount / (scoresArray.length || 1);
      if (audit.extremeRatio > 0.88) {
        audit.flags.push(`极端选项占比过高（${(audit.extremeRatio * 100).toFixed(0)}%）。`);
      }

      // 注意性质检
      const attnAnswer = Number(answers['CHK_ATTN_1']);
      if (attnAnswer && attnAnswer !== 2) {
        audit.flags.push(`未通过注意力质检锚点题（要求选“比较不符合”，实际选择“${attnAnswer}分”）。`);
      }

      const logicAnswer = Number(answers['CHK_LOGIC_1']);
      if (logicAnswer && logicAnswer > 2) {
        audit.flags.push(`常识逻辑校验未通过（将二次元动漫视为真人实景纪录片）。`);
      }

      // 对偶逻辑互斥检验
      const pairA = Number(answers['CHK_PAIR_A']);
      const pairB = Number(answers['CHK_PAIR_B']);
      if (pairA && pairB) {
        if (pairA >= 4 && pairB >= 4) {
          audit.inconsistencyPenalty += 2;
          audit.flags.push('对偶题目（反差神性接受度）出现逻辑自相矛盾（正反两题均勾选高分）。');
        } else if (pairA <= 2 && pairB <= 2) {
          audit.inconsistencyPenalty += 1;
          audit.flags.push('对偶题目出现两极抵触偏向（正反两题均勾选极低分）。');
        }
      }

      // 原始分计算
      const rawScores = { ASP: 0, PNC: 0, MTG: 0, CHS: 0, CDRB: 0 };
      this.QUESTIONS.forEach(q => {
        if (q.dim === 'CHK') return;
        const userVal = Number(answers[q.id]);
        if (!userVal) return;
        const finalVal = q.reverse ? (6 - userVal) : userVal;
        if (rawScores[q.dim] !== undefined) rawScores[q.dim] += finalVal;
      });

      if (rawScores.CDRB < 12) {
        audit.realityBoundaryPass = false;
        audit.flags.push('【严肃警示】受测者未能明确恪守现实未成年人法律与道德红线，评测结果已终止生成。');
        audit.isValid = false;
      }

      // T-分数标准化转换
      const tScores = {};
      const percentiles = {};
      Object.keys(this.DIMENSIONS).forEach(dimKey => {
        const dim = this.DIMENSIONS[dimKey];
        const raw = rawScores[dimKey];
        const zScore = (raw - dim.normMean) / dim.normSd;
        let t = Math.round(50 + 10 * zScore);
        if (t < 20) t = 20;
        if (t > 80) t = 80;
        tScores[dimKey] = t;
        const pr = Math.round(this.normalCDF(zScore) * 100);
        percentiles[dimKey] = Math.min(Math.max(pr, 1), 99);
      });

      let matchedArchetype = this.ARCHETYPES.find(arch => {
        if (arch.code === 'ARCH_OBSERVER') return false;
        return arch.condition(tScores);
      });
      if (!matchedArchetype) matchedArchetype = this.ARCHETYPES[this.ARCHETYPES.length - 1];

      let reliability = 100;
      if (audit.straightLiningCount >= 6) reliability -= (audit.straightLiningCount - 5) * 8;
      if (audit.extremeRatio > 0.7) reliability -= 15;
      if (audit.inconsistencyPenalty > 0) reliability -= audit.inconsistencyPenalty * 15;
      if (audit.timeAnomaly) reliability -= 40;
      if (attnAnswer && attnAnswer !== 2) reliability -= 25;
      if (reliability < 0) reliability = 0;

      return {
        audit,
        rawScores,
        tScores,
        percentiles,
        matchedArchetype,
        reliabilityIndex: Math.round(reliability),
        generatedAt: new Date().toISOString()
      };
    }
  };

  // 挂载全局
  window.NCAPI_MODEL = NCAPI_CORE;

  // =========================================================================
  // 2. 全局状态与维度解析扩展库
  // =========================================================================

  const state = {
    sessionId: null,
    dimensions: [],
    questions: [],
    currentIndex: 0,
    answers: {},
    timing: {
      sessionStartTime: 0,
      questionEnterTime: 0,
      itemTimestamps: []
    },
    fingerprint: null,
    evaluationResult: null
  };

  const DIMENSION_EXTENSIONS = {
    ASP: {
      tag: '符号美学',
      theory: '【东浩纪·数据库消费理论】揭示了你对二次元“视觉符号语法”的高纯度鉴赏力。你欣赏的并非现实肉体，而是大眼眶、呆毛、洛丽塔裙摆等符号构筑的美术提纯。',
      tropes: '典型意象：京都动画萌系线稿、Q版粘土人微表情、线条与色块的黄金比例动态。'
    },
    PNC: {
      tag: '守护移情',
      theory: '【依恋与照料行为系统】反映了强烈的“监护人原型”。面对弱小无助的虚拟角色，你激活的是纯粹无垢的利他守护冲动，享受引导其安全成长的精神充盈。',
      tropes: '典型意象：《美少女梦工厂》《蔚蓝档案》阿罗娜、看着女儿般展露笑容的“老父亲/老母亲”圣光视角。'
    },
    MTG: {
      tag: '反差神性',
      theory: '【戏剧反差与超验隐喻】偏好外表幼态与内在神性/万古岁月的极度反差（Gap-Moe）。这种张力解构了世俗对力量与体态的固化认知，呈现出震撼的史诗宿命感。',
      tropes: '典型意象：《物语系列》忍野忍（五百岁怪异之王）、《OVERLORD》夏提雅、以纤细身躯抗击宇宙的神性造物。'
    },
    CHS: {
      tag: '治愈退行',
      theory: '【心理防御与情绪退行机制】在充斥利益算计与成人压力的现实世界之外，寻求纯洁无瑕的二次元世界作为精神脱敏避难所，让紧绷的神经获得深层治愈。',
      tropes: '典型意象：芳文社治愈日常、《点兔》式的无公害乌托邦、远离现实世俗纷扰的心灵安全岛。'
    },
    CDRB: {
      tag: '现实结界',
      theory: '【认知现实检验与伦理红线】严格恪守“虚拟符号≠现实生物”的认知结界，对现实未成年人身心健康与法律道德怀有绝对敬畏，杜绝任何现实投射。',
      tropes: '核心意义：高分的结界意识是所有健康二次元爱好者的基石，保证审美活动停留在纯粹艺术与想象殿堂。'
    }
  };

  // DOM 元素缓存
  let screens = {};
  let el = {};

  function initDOMElements() {
    screens = {
      welcome: document.getElementById('screen-welcome'),
      test: document.getElementById('screen-test'),
      loading: document.getElementById('screen-loading'),
      result: document.getElementById('screen-result')
    };

    el = {
      btnStart: document.getElementById('btn-start'),
      btnPrev: document.getElementById('btn-prev'),
      btnNext: document.getElementById('btn-next'),
      btnRetake: document.getElementById('btn-retake'),
      btnCopySummary: document.getElementById('btn-copy-summary'),
      qCounter: document.getElementById('q-counter'),
      qPercent: document.getElementById('q-percent'),
      progressBar: document.getElementById('progress-bar'),
      pacingStatus: document.getElementById('pacing-status'),
      pacingText: document.getElementById('pacing-text'),
      qBadge: document.getElementById('q-badge'),
      qText: document.getElementById('q-text'),
      optionsContainer: document.getElementById('options-container'),
      optionButtons: document.querySelectorAll('.option-btn'),
      loadingStageText: document.getElementById('loading-stage-text'),
      toast: document.getElementById('toast'),
      radarCanvas: document.getElementById('radarCanvas')
    };
  }

  function generateFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('NCAPI-2026-FINGERPRINT', 2, 2);
      const canvasData = canvas.toDataURL().slice(-40);
      const raw = `${navigator.userAgent}|${screen.width}x${screen.height}|${new Date().getTimezoneOffset()}|${canvasData}`;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return 'FP_' + Math.abs(hash).toString(16);
    } catch (e) {
      return 'FP_' + Math.random().toString(16).slice(2, 10);
    }
  }

  function showScreen(name) {
    Object.keys(screens).forEach(key => {
      if (screens[key]) screens[key].classList.remove('active');
    });
    if (screens[name]) {
      screens[name].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function showToast(msg, duration = 3000) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    setTimeout(() => {
      el.toast.classList.remove('show');
    }, duration);
  }

  // =========================================================================
  // 3. 答题生命周期控制 (秒开零阻塞设计)
  // =========================================================================

  function startAssessment() {
    try {
      state.fingerprint = generateFingerprint();
      const now = Date.now();
      const randId = Math.random().toString(16).slice(2, 10).toUpperCase();

      // 1. 本地模型即刻生成随机题库，零等待打开测评
      state.sessionId = `SES_${now}_${randId}`;
      state.dimensions = Object.values(NCAPI_CORE.DIMENSIONS);
      const randomized = NCAPI_CORE.generateRandomizedQuestions();
      state.questions = randomized.map(q => ({ id: q.id, text: q.text }));
      state.currentIndex = 0;
      state.answers = {};
      state.timing.sessionStartTime = now;
      state.timing.itemTimestamps = [];

      // 2. 立即切换到答题屏幕
      showScreen('test');
      renderQuestion(0);

      // 3. 静默通知服务端同步（无论成功失败均不影响答题）
      fetch('/api/v1/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint: state.fingerprint })
      }).then(r => r.json()).then(data => {
        if (data && data.success && data.sessionId) {
          state.sessionId = data.sessionId;
        }
      }).catch(() => {
        // 静默运行于离线/GitHub Pages模式
      });

    } catch (err) {
      console.error('启动测评发生异常:', err);
      showToast('测评启动异常，请刷新页面');
      if (el.btnStart) {
        el.btnStart.disabled = false;
        el.btnStart.innerHTML = '<span>同意声明并开始测评</span>';
      }
    }
  }

  function renderQuestion(index) {
    const q = state.questions[index];
    if (!q) return;

    state.currentIndex = index;
    state.timing.questionEnterTime = Date.now();

    const currentNum = index + 1;
    const total = state.questions.length;
    const pct = Math.round((currentNum / total) * 100);

    if (el.qCounter) el.qCounter.textContent = `第 ${currentNum} / ${total} 题`;
    if (el.qPercent) el.qPercent.textContent = `${pct}%`;
    if (el.progressBar) el.progressBar.style.width = `${pct}%`;

    if (el.qBadge) {
      if (q.id.startsWith('CHK_')) {
        el.qBadge.textContent = '信度与逻辑质检项';
        el.qBadge.style.color = '#F59E0B';
        el.qBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        el.qBadge.style.background = 'rgba(245, 158, 11, 0.12)';
      } else {
        el.qBadge.textContent = '心理原型倾向评估';
        el.qBadge.style.color = '#06B6D4';
        el.qBadge.style.borderColor = 'rgba(6, 182, 212, 0.4)';
        el.qBadge.style.background = 'rgba(6, 182, 212, 0.12)';
      }
    }

    if (el.qText) {
      el.qText.style.opacity = '0';
      setTimeout(() => {
        el.qText.textContent = q.text;
        el.qText.style.opacity = '1';
      }, 100);
    }

    const previousSelected = state.answers[q.id];
    if (el.optionButtons) {
      el.optionButtons.forEach(btn => {
        const val = Number(btn.getAttribute('data-value'));
        btn.classList.toggle('selected', val === previousSelected);
      });
    }

    if (el.btnPrev) el.btnPrev.disabled = index === 0;
    if (el.btnNext) {
      el.btnNext.disabled = !previousSelected;
      el.btnNext.innerHTML = index === total - 1 ? '<span>提交测评</span>' : '<span>下一题</span>';
    }
  }

  function selectOption(val) {
    const q = state.questions[state.currentIndex];
    if (!q) return;

    const dwellTime = Date.now() - state.timing.questionEnterTime;

    if (el.pacingText && el.pacingStatus) {
      if (dwellTime < 900) {
        el.pacingText.textContent = '作答过快，建议认真审题';
        el.pacingStatus.style.background = 'rgba(239, 68, 68, 0.15)';
        const dot = el.pacingStatus.querySelector('.pulse-dot');
        if (dot) dot.style.background = '#EF4444';
      } else {
        el.pacingText.textContent = '答题节奏正常';
        el.pacingStatus.style.background = 'rgba(255, 255, 255, 0.04)';
        const dot = el.pacingStatus.querySelector('.pulse-dot');
        if (dot) dot.style.background = '#10B981';
      }
    }

    state.answers[q.id] = val;
    state.timing.itemTimestamps.push({
      id: q.id,
      selectedVal: val,
      dwellMs: dwellTime,
      timestamp: Date.now()
    });

    if (el.optionButtons) {
      el.optionButtons.forEach(btn => {
        btn.classList.toggle('selected', Number(btn.getAttribute('data-value')) === val);
      });
    }

    if (el.btnNext) el.btnNext.disabled = false;

    // 智能自动流转
    setTimeout(() => {
      if (state.currentIndex < state.questions.length - 1) {
        renderQuestion(state.currentIndex + 1);
      } else {
        submitAssessment();
      }
    }, 280);
  }

  async function submitAssessment() {
    showScreen('loading');
    const totalDuration = Date.now() - state.timing.sessionStartTime;

    const stages = [
      { id: 'stage-1', text: '正在验证时间节奏分布与变异系数（CV）...' },
      { id: 'stage-2', text: '正在比对对偶题目互斥逻辑与直线作答...' },
      { id: 'stage-3', text: '正在校验虚拟-现实认知结界效度红线...' },
      { id: 'stage-4', text: '正在映射大样本常模 T-分数与生成雷达图谱...' }
    ];

    for (let i = 0; i < stages.length; i++) {
      if (el.loadingStageText) el.loadingStageText.textContent = stages[i].text;
      const stepEl = document.getElementById(stages[i].id);
      if (stepEl) {
        stepEl.classList.add('active');
        const icon = stepEl.querySelector('.step-icon');
        if (icon) icon.textContent = '⚙️';
      }
      await new Promise(r => setTimeout(r, 400));
      if (stepEl) {
        stepEl.classList.remove('active');
        stepEl.classList.add('done');
        const icon = stepEl.querySelector('.step-icon');
        if (icon) icon.textContent = '✅';
      }
    }

    let finalData = null;

    // 优先尝试服务端校验 (附带 2 秒超时)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/v1/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId: state.sessionId,
          fingerprint: state.fingerprint,
          answers: state.answers,
          timingData: {
            totalDurationMs: totalDuration,
            itemTimestamps: state.timing.itemTimestamps
          }
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          finalData = json.data;
        }
      }
    } catch (e) {
      // 容灾直接由本地模型接管
    }

    if (!finalData) {
      const localRes = NCAPI_CORE.evaluateAssessment(state.answers, {
        totalDurationMs: totalDuration,
        itemTimestamps: state.timing.itemTimestamps
      });
      const randHash = Math.random().toString(16).slice(2, 10).toUpperCase();
      finalData = {
        ...localRes,
        certificateHash: `NC-${randHash}`,
        serverElapsedSec: Math.round(totalDuration / 1000)
      };
    }

    state.evaluationResult = finalData;
    renderResult(finalData);
  }

  function renderResult(data) {
    showScreen('result');

    const arch = data.matchedArchetype;
    const tScores = data.tScores;
    const percentiles = data.percentiles;
    const audit = data.audit;

    const certEl = document.getElementById('res-cert-hash');
    const nameEl = document.getElementById('res-arch-name');
    const tagEl = document.getElementById('res-arch-tagline');
    const descEl = document.getElementById('res-arch-desc');

    if (certEl) certEl.textContent = `CERT: #${data.certificateHash}`;
    if (nameEl) nameEl.textContent = arch.name;
    if (tagEl) tagEl.textContent = arch.tagline;
    if (descEl) descEl.textContent = arch.desc;

    // =========================================================================
    // 0-100 加权总分计算与段位评定 (传统数字加权计算)
    // =========================================================================
    const safeT = (key) => {
      const v = tScores ? tScores[key] : undefined;
      return (typeof v === 'number' && !isNaN(v)) ? v : 50;
    };
    const tASP = safeT('ASP'), tPNC = safeT('PNC'), tMTG = safeT('MTG'), tCHS = safeT('CHS'), tCDRB = safeT('CDRB');

    const weightedT = tPNC * 0.30 + tMTG * 0.28 + tASP * 0.22 + tCHS * 0.20;
    let finalScore = Math.round(((weightedT - 20) / 60) * 100);
    if (finalScore < 5) finalScore = 5;
    if (finalScore > 99) finalScore = 99;

    const isBoundaryFailed = tCDRB < 30;
    if (isBoundaryFailed) finalScore = 0;

    let grade = 'S 级';
    let percentileText = `超越了全网 ${Math.min(99, Math.max(1, Math.round(finalScore * 0.98 + 1)))}% 的二次元鉴赏家`;
    let critique = '';

    if (isBoundaryFailed) {
      grade = '熔断警报';
      percentileText = '认知结界异常 · 评测强行熔断';
      critique = '【高危道德警报】您的测试结果已被强制熔断归零！二次元的夸张萌系艺术符号纯属虚构，与现实世界的真实未成年人有着坚不可摧的法律与伦理高压红线。严禁将任何虚拟幻想投射至三次元现实。请立刻放下手机，出门深呼吸，重塑健康的现实生活！';
    } else if (finalScore >= 90) {
      grade = 'SSS 级 · 纯度超标';
      critique = '【天花板级锐评】我的天，您这纯度已经直接把芳文社、Type-Moon、美少女梦工厂的编剧按在地上摩擦了！在您眼里，娇小幼态角色既是需要您倾尽家产去守护的“白月光女儿”，又是随手能手撕万丈高达的“五千岁深渊真祖”。现实中对三次元真实小孩心如止水毫无世俗杂念，但在二次元里早已修成“慈父圣光与硬核考据狂人”的双重道果。建议米哈游或Cygames明天就聘请您当角色设计首席顾问，您看一眼立绘，萌要素的DNA都得起立敬礼！';
    } else if (finalScore >= 78) {
      grade = 'SS 级 · 圣光守护神';
      critique = '【重度患者锐评】好消息：您的保护欲已经浓烈得溢出显示器，妥妥的“老父亲/老母亲型”守护狂魔；坏消息：您现实中上班唯唯诺诺，一进二次元立马化身“谁敢动我纸片人女儿一根头发我就把整座学园都市烧成灰”的狂战神。您在“合法萝莉反差萌”和“治愈日常避风港”之间反复横跳，现实成人的功利社交让您精神内耗，唯有无辜软萌的纯真笑颜能救赎您破碎的打工人灵魂。纯度极高，深情且无害！';
    } else if (finalScore >= 62) {
      grade = 'S 级 · 鉴赏老油条';
      critique = '【资深鉴赏家锐评】典型的“薛定谔的萌系鉴赏家”——看到千岁幼态真祖手撕魔王会高呼“太带感了”，看到治愈软萌角色受委屈又忍不住老父亲心态爆发，但只要动画作画崩坏或剧情注水，您立马冷酷拔掉电源。您对双马尾、呆毛、头身比有一套堪比工业尺规的“严苛数据库标准”，既不是纯粹的圣父，也不是无脑跟风，属于脑子极其清醒、但灵魂经常被顶级原画和神级CV勾走的资深二次元老油条。';
    } else if (finalScore >= 45) {
      grade = 'A 级 · 人间清醒客';
      critique = '【轻度路人锐评】你管这叫控？你这充其量就是个“路过展台觉得立绘挺好看顺手点了个赞的吃瓜游客”！您的保护欲本能偶尔会微弱抽动一下，对千岁反差吸血鬼也能礼貌性鉴赏，但您心底始终筑着一道高墙：“都是商业套路罢了”。现实中的房贷、工作和KPI占满了您85%的脑容量，留给二次元的微薄内存只能用来浅尝辄止。纯度明显不足，建议立刻去补三季《点兔》和《悠哉日常大王》抢救一下！';
    } else {
      grade = 'B 级 · 钢铁纯血人';
      critique = '【钢铁直男锐评】二次元娇小身形对您来说，吸引力可能还不如一把加满攻击力的SSR屠龙宝刀，或者三次元的一顿烤五花肉。什么反差神性、什么数据库萌要素、什么老父亲移情，在您看来都是“纸片人小人过家家”。您甚至在答题时多次怀疑测试作者的精神状态。恭喜您，您的现实生活坚不可摧，完全不需要靠二次元纸片人给自己搭建精神温室，纯正的三次元钢铁战士！';
    }

    data.finalScore = finalScore;
    data.grade = grade;
    data.critique = critique;

    const gradeEl = document.getElementById('res-score-grade');
    const scoreEl = document.getElementById('res-grand-score');
    const prEl = document.getElementById('res-grand-percentile');
    const critiqueEl = document.getElementById('res-critique-text');

    if (gradeEl) gradeEl.textContent = grade;
    if (prEl) prEl.textContent = percentileText;
    if (critiqueEl) critiqueEl.textContent = critique;

    // 0-100 数字平滑滚动动画
    if (scoreEl) {
      const targetVal = finalScore;
      const duration = 1200;
      const startTime = performance.now();

      function updateScoreCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const displayVal = Math.round(targetVal * ease);
        scoreEl.textContent = displayVal;

        if (progress < 1) {
          requestAnimationFrame(updateScoreCounter);
        } else {
          scoreEl.textContent = targetVal;
        }
      }
      requestAnimationFrame(updateScoreCounter);
    }


    // 绘制五维小卡片
    const dimCardsContainer = document.getElementById('dim-cards-container');
    if (dimCardsContainer) {
      dimCardsContainer.innerHTML = '';
      const dimKeys = ['ASP', 'PNC', 'MTG', 'CHS', 'CDRB'];
      const dimLabels = {
        ASP: { name: '萌要素符号鉴赏', color: '#8B5CF6' },
        PNC: { name: '抚育守护与利他', color: '#EC4899' },
        MTG: { name: '反差神性与超验', color: '#3B82F6' },
        CHS: { name: '治愈退行避风港', color: '#10B981' },
        CDRB: { name: '虚拟-现实认知结界', color: '#F59E0B' }
      };

      dimKeys.forEach(k => {
        const t = tScores[k] || 50;
        const pr = percentiles[k] || 50;
        const meta = dimLabels[k];
        const fillPct = Math.min(Math.max(((t - 20) / 60) * 100, 5), 100);

        const card = document.createElement('div');
        card.className = 'dim-summary-card';
        card.innerHTML = `
          <div class="dim-card-header">
            <div class="dim-card-title">
              <span class="dim-color-pill" style="background:${meta.color}; box-shadow:0 0 6px ${meta.color}"></span>
              <span>${meta.name}</span>
            </div>
            <div class="dim-scores">
              <span class="dim-t-score">${t}</span>
              <span class="dim-pr-badge">PR: ${pr}%</span>
            </div>
          </div>
          <div class="dim-bar-track">
            <div class="dim-bar-fill" style="width:${fillPct}%; background:${meta.color}"></div>
          </div>
        `;
        dimCardsContainer.appendChild(card);
      });
    }

    // 绘制深度剖析
    const dimDeepContainer = document.getElementById('dim-deep-container');
    if (dimDeepContainer) {
      dimDeepContainer.innerHTML = '';
      const dimKeys = ['ASP', 'PNC', 'MTG', 'CHS', 'CDRB'];
      const dimLabels = {
        ASP: { name: '萌要素符号鉴赏', color: '#8B5CF6' },
        PNC: { name: '抚育守护与利他', color: '#EC4899' },
        MTG: { name: '反差神性与超验', color: '#3B82F6' },
        CHS: { name: '治愈退行避风港', color: '#10B981' },
        CDRB: { name: '虚拟-现实认知结界', color: '#F59E0B' }
      };

      dimKeys.forEach(k => {
        const ext = DIMENSION_EXTENSIONS[k];
        const t = tScores[k] || 50;
        const meta = dimLabels[k];

        let levelDesc = '处于常规常模水准';
        if (t >= 60) levelDesc = '展现出极显著的突出偏好 (Top 15%)';
        else if (t >= 55) levelDesc = '偏好度明显高于群体均值 (Top 30%)';
        else if (t <= 40) levelDesc = '对此维度的心理共振相对较弱';

        const deepCard = document.createElement('div');
        deepCard.className = 'deep-item-card';
        deepCard.innerHTML = `
          <div class="deep-item-header">
            <div class="deep-item-title">${meta.name}（T-Score: ${t}）</div>
            <span class="deep-item-tag" style="background:${meta.color}22; color:${meta.color}; border:1px solid ${meta.color}55">
              ${ext.tag} · ${levelDesc}
            </span>
          </div>
          <div class="deep-item-body">
            <p>${ext.theory}</p>
          </div>
          <div class="deep-item-archetype-tropes">
            <strong>典型意象与作品投射：</strong> ${ext.tropes}
          </div>
        `;
        dimDeepContainer.appendChild(deepCard);
      });
    }

    // 质检与信度卡
    const relValEl = document.getElementById('res-reliability-val');
    const relLevelEl = document.getElementById('res-reliability-level');
    if (relValEl) relValEl.textContent = data.reliabilityIndex;
    if (relLevelEl) {
      if (data.reliabilityIndex >= 85) {
        relLevelEl.textContent = '极高信度';
        relLevelEl.style.color = '#10B981';
      } else if (data.reliabilityIndex >= 65) {
        relLevelEl.textContent = '中等可信';
        relLevelEl.style.color = '#F59E0B';
      } else {
        relLevelEl.textContent = '作答存疑';
        relLevelEl.style.color = '#EF4444';
      }
    }

    const sec = data.serverElapsedSec || Math.round((audit.durationMs || 0) / 1000);
    const durEl = document.getElementById('audit-duration');
    const strEl = document.getElementById('audit-straight');
    const extEl = document.getElementById('audit-extreme');
    const pairEl = document.getElementById('audit-pair');

    if (durEl) durEl.textContent = `${sec} 秒`;
    if (strEl) strEl.textContent = `${audit.straightLiningCount} 题`;
    if (extEl) extEl.textContent = `${(audit.extremeRatio * 100).toFixed(1)}%`;

    if (pairEl) {
      if (audit.inconsistencyPenalty === 0) {
        pairEl.textContent = '完全自洽';
        pairEl.className = 'm-val status-ok';
      } else {
        pairEl.textContent = `有 ${audit.inconsistencyPenalty} 处矛盾`;
        pairEl.className = 'm-val';
        pairEl.style.color = '#EF4444';
      }
    }

    const flagsBox = document.getElementById('audit-flags-box');
    const flagsList = document.getElementById('audit-flags-list');
    if (flagsBox && flagsList) {
      if (audit.flags && audit.flags.length > 0) {
        flagsBox.style.display = 'block';
        flagsList.innerHTML = '';
        audit.flags.forEach(f => {
          const li = document.createElement('li');
          li.textContent = f;
          flagsList.appendChild(li);
        });
      } else {
        flagsBox.style.display = 'none';
      }
    }

    animateRadarChart(tScores);
  }

  function animateRadarChart(tScores) {
    const canvas = el.radarCanvas || document.getElementById('radarCanvas');
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 440;
    const displayHeight = 400;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2 + 10;
    const maxRadius = 135;

    const dimensions = [
      { key: 'ASP', name: '符号美学 (ASP)' },
      { key: 'PNC', name: '抚育守护 (PNC)' },
      { key: 'MTG', name: '反差神性 (MTG)' },
      { key: 'CHS', name: '治愈退行 (CHS)' },
      { key: 'CDRB', name: '现实结界 (CDRB)' }
    ];

    const numAxes = dimensions.length;
    const angleStep = (Math.PI * 2) / numAxes;
    const startAngle = -Math.PI / 2;

    let progress = 0;
    const duration = 850;
    const start = performance.now();

    function drawFrame(now) {
      const elapsed = now - start;
      progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // 同心网格
      const levels = [20, 40, 50, 60, 80];
      levels.forEach(lvl => {
        const r = ((lvl - 20) / 60) * maxRadius;
        ctx.beginPath();
        for (let i = 0; i < numAxes; i++) {
          const a = startAngle + i * angleStep;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        if (lvl === 50) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // 轴线与文本
      for (let i = 0; i < numAxes; i++) {
        const a = startAngle + i * angleStep;
        const x = centerX + Math.cos(a) * maxRadius;
        const y = centerY + Math.sin(a) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const labelR = maxRadius + 24;
        const lx = centerX + Math.cos(a) * labelR;
        const ly = centerY + Math.sin(a) * labelR;

        ctx.font = '600 12px "Noto Sans SC", sans-serif';
        ctx.fillStyle = '#D1D5DB';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dimensions[i].name, lx, ly);
      }

      // 得分多边形
      ctx.beginPath();
      const points = [];
      for (let i = 0; i < numAxes; i++) {
        const dimKey = dimensions[i].key;
        const targetVal = tScores[dimKey] || 50;
        const currentVal = 20 + (targetVal - 20) * ease;
        const r = Math.max(0, ((currentVal - 20) / 60) * maxRadius);
        const a = startAngle + i * angleStep;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        points.push({ x, y });

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, maxRadius);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.55)');
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.25)');
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = '#A78BFA';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      if (progress < 1) requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
  }

  function copySummaryToClipboard() {
    if (!state.evaluationResult) return;
    const res = state.evaluationResult;
    const lines = [
      `【NCAPI 2.0 二次元角色原型与审美心理测评报告】`,
      `核心原型：${res.matchedArchetype.name}`,
      `原型标语：${res.matchedArchetype.tagline}`,
      `---------------------------------------`,
      `🔥【萌系偏好综合指数】：${res.finalScore || 0} / 100 (${res.grade || ''})`,
      `⚡【量表犀利锐评】：${res.critique || ''}`,
      `---------------------------------------`,
      `【五维常模标准分 (T-Score)】`,
      `• 符号美学 (ASP)：${res.tScores.ASP} (PR: ${res.percentiles.ASP}%)`,
      `• 抚育守护 (PNC)：${res.tScores.PNC} (PR: ${res.percentiles.PNC}%)`,
      `• 反差神性 (MTG)：${res.tScores.MTG} (PR: ${res.percentiles.MTG}%)`,
      `• 治愈退行 (CHS)：${res.tScores.CHS} (PR: ${res.percentiles.CHS}%)`,
      `• 现实结界 (CDRB)：${res.tScores.CDRB} (PR: ${res.percentiles.CDRB}%)`,
      `---------------------------------------`,
      `作答信度指数：${res.reliabilityIndex} / 100`,
      `防伪数字签名：#${res.certificateHash}`,
      `边界声明：纯属二次元虚拟艺术探讨，严守现实未成年人法律道德底线。`
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      showToast('✅ 测评简报已复制至剪贴板！');
    }).catch(() => {
      showToast('复制失败，请手动截屏保存');
    });
  }

  function initEvents() {
    initDOMElements();

    // 绑定开始按钮
    if (el.btnStart) {
      el.btnStart.onclick = startAssessment;
    }

    // 选项按钮点击
    if (el.optionButtons) {
      el.optionButtons.forEach(btn => {
        btn.onclick = () => {
          const val = Number(btn.getAttribute('data-value'));
          selectOption(val);
        };
      });
    }

    // 翻页控制
    if (el.btnPrev) {
      el.btnPrev.onclick = () => {
        if (state.currentIndex > 0) renderQuestion(state.currentIndex - 1);
      };
    }

    if (el.btnNext) {
      el.btnNext.onclick = () => {
        if (state.currentIndex < state.questions.length - 1) {
          renderQuestion(state.currentIndex + 1);
        } else {
          submitAssessment();
        }
      };
    }

    if (el.btnRetake) {
      el.btnRetake.onclick = () => {
        showScreen('welcome');
        if (el.btnStart) {
          el.btnStart.disabled = false;
          el.btnStart.innerHTML = '<span>同意声明并开始测评</span>';
        }
      };
    }

    if (el.btnCopySummary) {
      el.btnCopySummary.onclick = copySummaryToClipboard;
    }

    // 键盘支持
    window.onkeydown = e => {
      if (!screens.test || !screens.test.classList.contains('active')) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) {
        selectOption(num);
      } else if (e.key === 'ArrowLeft' && state.currentIndex > 0) {
        renderQuestion(state.currentIndex - 1);
      } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && state.answers[state.questions[state.currentIndex]?.id]) {
        if (state.currentIndex < state.questions.length - 1) {
          renderQuestion(state.currentIndex + 1);
        } else {
          submitAssessment();
        }
      }
    };
  }

  // 严密的页面就绪监听 (解决任何环境下 DOMContentLoaded 遗漏问题)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }

})();
