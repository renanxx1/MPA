          class Chronometer {
            constructor(id, activity_name, h, m, s) {
              this.h = h;
              this.m = m;
              this.s = s;
              this.activity_name = activity_name;
              this.id = id;
            }
            start() {
              var hour = this.h;
              var minute = this.m;
              var second = this.s;
			  var id = this.id;
              var activity = this.activity_name;

              this.id = setInterval(function () {
                if (second == 60) { minute++; second = 0; }
                if (minute == 60) { hour++; second = 0; minute = 0; }

                if (second < 10) {
                  document.getElementById("modalsecond_" + id).innerHTML = "0" + second;
                  $('#backsecond_' + id).html("0" + second);
                } else {
                  document.getElementById("modalsecond_" + id).innerHTML = second;
                  $('#backsecond_' + id).html(second);
                }

                if (hour < 10) {
                  document.getElementById("modalhour_" + id).innerHTML = "0" + hour;
                  $('#backhour_' + id).html("0" + hour);
                } else {
                  document.getElementById("modalhour_" + id).innerHTML = hour;
                  $('#backhour_' + id).html(hour);
                }
                if (minute < 10) {
                  document.getElementById("modalminute_" + id).innerHTML = "0" + minute;
                  $('#backminute_' + id).html("0" + minute);
                } else {
                  document.getElementById("modalminute_" + id).innerHTML = minute;
                  $('#backminute_' + id).html(minute);
                }
                second++;
              }, 1000);

            }
            pause() {
              clearInterval(this.id);
            }

          }