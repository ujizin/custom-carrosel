(function($){
    const DESKTOP_SCREEN = 1100;
    const MOBILE_SCREEN = 750;
    const $cards = () => $.querySelectorAll('.cards__content__card');
    let _totalCards = undefined;

    const isDesktop = () => getWidthScreen() > DESKTOP_SCREEN;
    
    const addClass = function(className){
        const $classes = Array.prototype.slice.call(arguments, 1);
        Array.prototype.forEach.call($classes, element => {
            if(element != undefined) 
                element.classList.add(className)
        })
    }

    const getPreviousCard = ($actual, index = null) => {
        const indexCard = index == null ? (isDesktop() ? 3 : 1) : index;
        const $lastCards = Array.prototype.slice.call($cards(), (getActualIndex() - indexCard))
        return insertCard('beforebegin', $lastCards, $actual);
    }

    const getNextCard = ($actual, index = null) => {
        const indexCard = index == null ? (isDesktop() ? 2 : 1) : index;
        const $firstCards = Array.prototype.slice.call($cards(), 0, indexCard)
        return insertCard('afterend', $firstCards, $actual)
    }

    const insertCard = (where, $cards, $actual) => {
        Array.prototype.forEach.call($cards, $el => {
            $el.classList.remove('card-none');
            $actual.insertAdjacentElement(where, $el);
        })
        return Array.prototype.slice.call($cards, -1)[0];
    }

    const addSiblingsClasses = $actual => {
        const $prev = $actual.previousElementSibling || getPreviousCard($actual);
        const $next = $actual.nextElementSibling || getNextCard($actual);

        addClass('cards-second', $prev, $next);
        
        if(isDesktop()){
            const $prevPrev = $prev.previousElementSibling || getPreviousCard($prev);
            const $nextNext = $next.nextElementSibling || getNextCard($next);

            if(!$prevPrev.previousElementSibling) getPreviousCard($prevPrev);
            if(!$nextNext.nextElementSibling) getNextCard($nextNext, 1)
            
            addClass('cards-third', $prevPrev, $nextNext);
        }   
    }
    
    const getMiddleCard = () => Math.floor(_totalCards / 2);

    const setInitStyles = () => {
        const middleCard = getMiddleCard();
        addClass('card-actual', $cards()[middleCard])
        setActualStyle();
        showOnlyTotalCards();
    }

    const setActualStyle = () => {
        const $actualCard = $.querySelector('.card-actual');
        addSiblingsClasses($actualCard)
    }

    const getWidthScreen = () => window.outerWidth;

    const setTotalCards = () => {
        _totalCards = getWidthScreen() > DESKTOP_SCREEN ? 6 : 4;
        _totalCards = getWidthScreen() < MOBILE_SCREEN ? 2 : _totalCards;
    }

    const getActualIndex = () => {
        let actualIndex = undefined;
        Array.prototype.forEach.call($cards(), ($el, index) =>{
            if(/card-actual/.test($el.className))
                actualIndex = index;
        })
        return actualIndex;
    }
    const showOnlyTotalCards = () => {
        const actualIndex = getActualIndex();
        const start = actualIndex - getMiddleCard();
        const finish = actualIndex + getMiddleCard();
        Array.prototype.forEach.call($cards(), (element, index) => {
            if(index < start || index > finish){
                element.classList.add('card-none')
            }
        })
    }
    
    const setListener = ($elements, event ,callback) => {
        Array.prototype.forEach.call($elements, el => {
            el.addEventListener(event, callback, false);
        });
    }

    const cardClicked = (event) => {
        const $card = event.currentTarget;
        selectCard($card);
    }

    const selectCard = ($card) => {
        resetClasses();
        addClass('card-actual', $card);
        showOnlyTotalCards();
        setActualStyle();
    }
    const setListeners = () => {
        window.addEventListener('resize', reset ,false);
        setListener($cards(), 'click', cardClicked);
    }

    const nextCard = () => {
        const $card = $cards()[getActualIndex() + 1] || $cards()[0];
        selectCard($card);
    }
    
    const prevCard = () => {
        const $card = $cards()[getActualIndex() + -1] || Array.prototype.slice.call($cards(), -1);
        selectCard($card);
    }
    const setLoopCards = () => {
        setInterval(nextCard, 3000);
    }

    const start = () => {
        setListeners();
        setTotalCards();
        setInitStyles();
        setLoopCards();
    }

    const resetClasses = () => {
        Array.prototype.forEach.call($cards(), (element, index) => {
            element.classList.remove('card-none');
            element.classList.remove('card-actual');
            element.classList.remove('cards-second');
            element.classList.remove('cards-third');
        })
    }
    const reset = () => {
        resetClasses()
        start();
    }
    start();
    
})(document);
