const { createConfession } = require('../services/submitService');
const { processApprovedQueue } = require('../workers/schedulerWorker');
const store = require('../store/store');

exports.submitConfession = async (req, res) => {
  try {
    console.log('📝 New confession submit request received');
    console.log('📦 Request body:', req.body);

    const result = await createConfession(req.body);

    console.log('✅ Confession created successfully:', result);

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('❌ Submit confession error:', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.postConfessionNow = async (req, res) => {
  try {
    const queueNumbers = [17, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41];

    queueNumbers.forEach((num) => {
      store.set(`state_${num}`, 'APPROVED');
      store.set(`caption_${num}`, `Confession #${num}`);
    });

    console.log('✅ Temporary approved states set for queue images');
    //console.log('🚀 Manual post-now request received');

    console.log('📦 Checking manually injected approved states...');
    console.log('state_17 =', store.get('state_17'));
    console.log('state_21 =', store.get('state_21'));
    console.log('state_41 =', store.get('state_41'));
    const result = await processApprovedQueue();

    console.log('📤 processApprovedQueue result:', result);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Posting failed - no response from worker',
      });
    }

    res.status(200).json({
      success: true,
      message: result.message || 'Posted successfully',
      data: result,
    });
  } catch (error) {
    console.error('❌ post-now error:', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
