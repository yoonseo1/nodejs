var M = {
  v: "v",
  f: function () {
    console.log(this.v);
  },
};

module.exports = M; //밖에서 사용할 수 있도록 함
