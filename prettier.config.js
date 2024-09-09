module.exports = {
  // 一行最多多少个字符（超过后会要求换行）。默认值 80
  printWidth: 100,
  // 使用单引号。默认值：false
  singleQuote: true,
  endOfLine: 'auto'
  // -----------------------------------------
  // 按照最简配置原则，以下配置项暂不设置
  // -----------------------------------------
  // 在语句末尾是否需要加分号。默认值：true
  // semi: false,
  // 使用制表符而不是空格缩进行。默认值：false
  // useTabs: false,
  // 指定每个缩进级别的空格数。默认值：2
  // tabWidth: 2,
  // vue文件中 <script> 和 <style> 标签内部代码是否缩进。默认值：false
  // vueIndentScriptAndStyle: true,
  // 在单行对象中，是否在左右保留一个空格。默认值 true
  // bracketSpacing: true
  // 是否在多行逗号分隔语法中，在最后一个元素后面加逗号。none 表示 始终不加尾随逗号
  // trailingComma: 'none'
  // 对一行字符数超过printWidth的文本换行 （仅对markdown文件有效）
  // proseWrap: 'never'
  // 去除 html 元素中的多余空格。默认值：css
  // css - 按照元素默认的 CSS display 样式决定是否移除多余空格
  // strict - 所有元素周围的空格和换行都有意义，保留所有空格，并在超出换行后黏连左右标签尖括号
  // ignore - 所有元素周围的空格和换行都没意义，删除所有空格，并正常换行
  // htmlWhitespaceSensitivity: 'strict'
  // 换行符类型。默认值：lf
  // lf - \n Linux和MacOS换行符
  // rlf - \r\n Windows换行符
  // cr - \r 很少用
  // auto - 根据文件首行使用哪种换行符决定整个文件使用哪一个
  // endOfLine: 'lf'
};
