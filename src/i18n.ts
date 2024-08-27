const en = {
  'app.error.tip': 'Something went wrong, check it out!',
  'app.decrypt.error.fail_to_read_init_vector':
    'Failed to read initial vector!',
  'app.decrypt.error.file_header_wrong': 'Encrypted file header error!',
  'app.decrypt.tip.output_file_exists':
    'Target output file exists, do you want to overwrite?',
  'app.decrypt.tip.redesignate_output_file':
    'Please specify the target output file again and execute this program.',
  'app.decrypt.ui.progress': 'Progress',
  'app.decrypt.ui.elapsed_time': 'Elapsed time',
  'app.decrypt.ui.estimated_remaining_time': 'Estimated remaining time',
  'app.decrypt.ui.total_time': 'Total time spent',
  'app.decrypt.ui.decryption_completed': 'Decryption completed!',
  'app.encrypt.tip.output_file_exists':
    'Target output file exists, do you want to overwrite?',
  'app.encrypt.tip.redesignate_output_file':
    'Please specify the target output file again and execute this program.',
  'app.encrypt.ui.progress': 'Progress',
  'app.encrypt.ui.elapsed_time': 'Elapsed time',
  'app.encrypt.ui.estimated_remaining_time': 'Estimated remaining time',
  'app.encrypt.ui.total_time': 'Total time spent',
  'app.encrypt.ui.encryption_completed': 'Encryption completed!'
};

const zh = {
  'app.error.tip': '出错了，检查一下吧！',
  'app.decrypt.error.fail_to_read_init_vector': '未能读取到初始向量！',
  'app.decrypt.error.file_header_wrong': '加密文件头错误！',
  'app.decrypt.tip.output_file_exists': '目标输出文件存在，要覆盖吗？',
  'app.decrypt.tip.redesignate_output_file':
    '请重新指定目标输出文件再执行本程序。',
  'app.decrypt.ui.progress': '进度',
  'app.decrypt.ui.elapsed_time': '已用时间',
  'app.decrypt.ui.estimated_remaining_time': '预计剩余时间',
  'app.decrypt.ui.total_time': '总共用时',
  'app.decrypt.ui.decryption_completed': '解密完成！',
  'app.encrypt.tip.output_file_exists': '目标输出文件存在，要覆盖吗？',
  'app.encrypt.tip.redesignate_output_file':
    '请重新指定目标输出文件再执行本程序。',
  'app.encrypt.ui.progress': '进度',
  'app.encrypt.ui.elapsed_time': '已用时间',
  'app.encrypt.ui.estimated_remaining_time': '预计剩余时间',
  'app.encrypt.ui.total_time': '总共用时',
  'app.encrypt.ui.encryption_completed': '加密完成！'
};

export type i18nType = {
  [index in keyof typeof en | keyof typeof zh]: string;
};

export const i18n = {
  en,
  zh
};
