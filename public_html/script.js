'use strict';

var table;

function onLoadInit() {
    table = new Table();
}

function newGame() {
    table.newGame();
}

var Table = function () {
    this.selectedCards = [];
    this.cards = [];
};

Table.prototype = {
    setLevel: function (level) {
        this.level = level;
        document.getElementById('levelValue').innerHTML = this.level;
    },
    getLevel: function () {
        return this.level;
    },
    setTime: function (time) {
        this.time = time;
        document.getElementById("timeValue").innerHTML = this.time;
    },
    getTime: function () {
        return this.time;
    },
    setScore: function (score) {
        this.score = score;
        document.getElementById("scoreValue").innerHTML = this.score;
    },
    getScore: function () {
        return this.score;
    },
    newGame: function () {
        clearInterval(this.counter);
        this.groupSize = 2;
        this.groupCount = 3;
        this.groupsToFind = this.groupCount;
        this.setLevel(1);
        this.setScore(0);
        this.setTime(20);
        this.prepareCards();
        this.counter = setInterval(this.timerEvent(), 1000);
    },
    prepareCards: function () {
        document.getElementById("table").innerHTML = "";
        this.generateCards();
        this.mixCards();
        this.drawCards();
    },
    generateCards: function () {
        this.cards = [];
        for (var i = 0; i < this.groupCount * this.groupSize; i++) {
            var card = new Card(Math.floor(i / this.groupSize) + 1, i);
            this.cards.push(card);
        }
    },
    mixCards: function () {
        for (var i in this.cards) {
            var randomI = Math.floor(Math.random() * this.cards.length);
            if (i !== randomI) {
                var card = this.cards[i];
                this.cards[i] = this.cards[randomI];
                this.cards[randomI] = card;

                this.cards[i].setIndex(i);
                this.cards [randomI].setIndex(randomI);
            }
        }
    },
    drawCards: function () {
        for (var i in this.cards) {
            var card = this.cards[i];
            document.getElementById("table").appendChild(card.getElement());
            card.generateClickListener();
            card.getElement().addEventListener("click", card.getClickListener());
            card.getElement().addEventListener("mouseover", card.getMouseOverListener());
            card.getElement().addEventListener("mouseout", card.getMouseOutListener());
        }
    },
    levelUp: function () {
        this.setLevel(this.getLevel() + 1);
        this.setScore(this.getScore() + 100);
        this.setTime(this.getTime() + this.groupCount * 5);
        this.groupCount++;
        this.groupsToFind = this.groupCount;
        this.prepareCards();
    },
    timerEvent: function () {
        return function () {
            table.setTime(table.getTime() - 1);
            if (table.getTime() <= 0) {
                clearInterval(table.counter);
                document.getElementById("table").innerHTML = "";
                alert("Konec hry. Dosažené skóre: " + table.getScore());
            }
        };
    }
};

Table.prototype.selectedCard = function (index) {
    var card = this.cards[index];

    if (this.selectedCards.length >= this.groupSize) {
        for (var i in this.selectedCards) {
            var c = this.selectedCards[i];
            c.hideCard();
        }
        this.selectedCards = [];
    }

    if (this.selectedCards.indexOf(card) > -1) {
        return;
    } else {
        card.showCard();
        this.selectedCards.push(card);
    }

    if (this.selectedCards.length < this.groupSize) {
        return;
    } else {
        var sameCards = true;
        for (var i in this.selectedCards) {
            if (i < (this.selectedCards.length - 1)) {
                if (this.selectedCards[i].getValue() !== this.selectedCards[++i].getValue()) {
                    sameCards = false;
                }
            }
        }

        if (sameCards) {
            for (var i in this.selectedCards) {
                var card = this.selectedCards[i];
                card.removeCard();
            }
            this.groupsToFind--;
            this.selectedCards = [];
            this.setScore(this.getScore() + 10);
        }

        if (this.groupsToFind === 0) {
            this.levelUp();
        }      
    }
};

var Card = function (value, index) {
    this.value = value;
    this.index = index;
    this.element = document.createElement("div");
    this.element.setAttribute("class", "card");

    var e = this.element;
    this.mouseOverListener = function () {
        e.style.background = "burlywood";
    };
    this.mouseOutListener = function () {
        e.style.background = "antiquewhite";
    };
    return this;
};

Card.prototype.getElement = function () {
    return this.element;
};

Card.prototype.getValue = function () {
    return this.value;
};

Card.prototype.setIndex = function (index) {
    this.index = index;
};

Card.prototype.getIndex = function () {
    return this.index;
};

Card.prototype.generateClickListener = function () {
    var index = this.index;
    this.clickListener = function () {
        table.selectedCard(index);
    };
    return this.clickListener;
};

Card.prototype.getClickListener = function () {
    return this.clickListener;
};

Card.prototype.getMouseOverListener = function () {
    return this.mouseOverListener;
};

Card.prototype.getMouseOutListener = function () {
    return this.mouseOutListener;
};

Card.prototype.hideCard = function () {
    this.getElement().style.background = "antiquewhite";
    this.getElement().addEventListener("mouseover", this.getMouseOverListener());
    this.getElement().addEventListener("mouseout", this.getMouseOutListener());
};
Card.prototype.showCard = function () {
    this.getElement().removeEventListener("mouseover", this.getMouseOverListener());
    this.getElement().removeEventListener("mouseout", this.getMouseOutListener());
    this.getElement().style.background = "#fff";
    this.getElement().style.backgroundSize = "100px 100px";
    this.getElement().style.backgroundImage = "url('./drawable/pic_" + this.getValue() + ".png')";
};
Card.prototype.removeCard = function () {
    this.getElement().style.background = "gainsboro";
    this.getElement().removeEventListener("click", this.getClickListener());
};