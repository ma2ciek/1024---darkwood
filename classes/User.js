function User() {
    this.mx = 0;
    this.my = 0;
    var self = this;

    window.addEventListener('mousemove', function (e) {
        self.mx = e.clientX;
        self.my = e.clientY;
    });
}

