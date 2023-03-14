export const creatorMaker = () => {
  (function (d, h, m) {
    var js: HTMLElement | any,
      fjs = d.getElementsByTagName(h)[0];
    if (d.getElementById(m)) {
      return;
    }
    js = d.createElement(h);
    js.id = m;
    js.onload = function () {
      // @ts-ignore
      window.makerWidgetComInit({
        position: "right",
        widget: "va3gtuaycqwfygxt-kqz6pavjpggacsnm-gsraqpzg6fvdjunt",
      });
    };
    js.src = "https://makerwidget.com/js/embed.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "dhm");
};
