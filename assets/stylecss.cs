@font-face {
  font-family: Acme;
  src: url("Acme-regular.ttf");
}
.cardb, #back, #reset, #submit, .border {
  border-color: #4A8C67;
  border-style: solid;
  border-width: 1px;
}

.cardb:hover, #submit:hover, #back:hover, #reset:hover {
  border-color: #4181ad;
  border-style: solid;
  border-width: 1px;
}

body {
  background: url("stardust.png");
font-family: Acme, Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  background-repeat: repeat;
  width: 99%;
}

#bdayQuestion {
  color: #4A8C67;
  background: #0A0D0C;
  display: block;
  position: absolute;
  border-radius: 50%;
  top: 25%;
  width: 50%;
  height: 370px;
  margin-left: 25%;
}

h1 {
  margin-top: 100px;
}

#bdayform {
  width: 50%;
  left: 25%;
  position: relative;
}

.border {
  padding-left: 5px;
}

#submit, .mdl-card__title-text, .mdl-card__supporting-text, #back, #reset {
  color: #4A8C67;
}

#error {
  display: none;
  font-family: sans-serif;
  margin-bottom: 0;
  font-size: 18px;
  color: lightyellow;
  letter-spacing: 1.5px;
}

#ajaxResults {
  font-family: "Times New Roman", Times, serif;
  color: #164059;
  display: none;
}

#back, #reset, #submit {
  background: #0A0D0C;
}

#submit:hover, #back:hover, #reset:hover {
  color: #4181ad;
}

.mdl-card {
  cursor: pointer;
}

#reset {
  display: none;
}

#back {
  float: right;
  display: none;
}

#cards {
  width: 100%;
  display: none;
}

.cen {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  width: 31%;
}

.cen2 {
  clear: both;
}

.demo-card-wide {
  background: #0A0D0C;
}

#moviesCard:hover .card, #usgsCard:hover .card, #nasaCard:hover .card {
  color: #4181ad;
}

dl {
  color: #5fd291;
  background-color: #0A0D0C;
}

dt {
  padding: 20px 0 0 15px;
}

.value {
  color: #91c7ec;
}

@media screen and(max-width: 1200px)
{
# bdayQuestion {
width: 70 %;
    margin - left: 15 %;
}
}
@media screen and(max-width: 825px)
{
# bdayQuestion {
width: 97 %;
    margin - left: 0;
}

  .cen {
    float: none;
    width: 100%;
  }

  #cards {
    width: 96%;
  }
}
@media screen and(max-width: 555px)
{
# bdayQuestion {
width: 95 %;
    margin - left: 0;
}

h1 {
    font-size: 30px;
  }

  #bdayform {
    left: 5%;
    width: 90%;
  }

  .cen {
    justify-content: left;
  }

  .text {
    font-size: 21px;
  }

  dl {
    font-size: 17px;
    letter-spacing: 1.5px;
  }

  dd {
    padding-top: 4px;
  }
}
@media screen and(max-width: 840px)
{
  .back {
    width: 50 %;
    }

  .reset {
    width: 5 %;
    }
}
@media screen and(min-width: 840px)
{
  .mdl - grid {
    padding: 8px 0 0 0;
    }
}

/*# sourceMappingURL=stylecss.cs.map */
