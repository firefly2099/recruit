export default {
  filters: {
    statusToWords(status) {
      let text = "";
      switch (status) {
        case "1":
          text = "Reviewing";
          break;
        case "2":
          text = "Confirmed";
          break;
        case "3":
          text = "Reviewed unsuccessfully";
          break;
      }
      return text;
    }
  },

  directives: {
    // 计算日期差
    dateDiff(el, binding) {
      let now = new Date(),
        month = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1),
        start = +(now.getFullYear().toString() + month + now.getDate()),
        end = +binding.value.end.replace(/-/g, ""),
        diff = 0;

      if (+new Date(binding.value.end) + 24 * 3600 * 1000 < +now) {
        diff = 0;
      } else {
        diff = end >= start ? Math.ceil((+new Date(binding.value.end) - now.getTime() + 24 * 3600 * 1000) / (24 * 3600 * 1000)) : 0;
      }
      el.textContent = diff;
    }
  }
}
