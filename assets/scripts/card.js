(function($){
    const $cards = () => $.querySelectorAll('.cards__content__card');
    const DESKTOP_SCREEN = 1100;
    const MOBILE_SCREEN = 750;
    let _totalCards = undefined;
    let _loopCards = undefined;
    let _resetTimer = undefined;
    
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
            $actual.insertAdjacentElement(where, $el);
            setTimeout(() => {
                $el.classList.remove('card-none');
            }, 0.1);
        })
        return Array.prototype.slice.call($cards, -1)[0];
    }

    const addSiblingsClasses = $actual => {
        // first card
        const $prev = $actual.previousElementSibling || getPreviousCard($actual);
        const $next = $actual.nextElementSibling || getNextCard($actual);

        addClass('cards-second', $prev, $next);
        
        if(isDesktop()){
            // second card
            const $prevPrev = $prev.previousElementSibling || getPreviousCard($prev);
            const $nextNext = $next.nextElementSibling || getNextCard($next);

            // third card
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

    const clearAndMove = (callback, event = null) => {
        clearInterval(_loopCards)
        clearTimeout(_resetTimer)
        _resetTimer = setTimeout(setLoopCards, 3000);
        callback(event);
    }

    const onMoveDrag = (event) => {
        event.preventDefault();
        const onMouseMove = (event) => {
            newLeft = event.clientX - shiftX - $content.getBoundingClientRect().left;
            const moveWith = Math.floor( newLeft / 300 );
            const absoluteMoveWith = Math.abs(moveWith);
            const isPositiveNumber = moveWith >= 0 || false;

            if (absoluteMoveWith > numberPassed){
                numberPassed = absoluteMoveWith;
                if(isPositiveNumber)
                    prevCard();
                else 
                    nextCard()
            }
        }

        function onMouseUp() {
            $.removeEventListener('mousemove', onMouseMove);
            $.removeEventListener('mouseup', onMouseUp);
        }
       
        let numberPassed = 0;
        let newLeft;
        const $content = event.currentTarget;
        let shiftX = event.clientX - $content.getBoundingClientRect().left;

        $.addEventListener('mousemove', onMouseMove);
        $.addEventListener('mouseup', onMouseUp);
    }
    const setListeners = () => {
        window.addEventListener('resize', () => clearAndMove(reset) ,false);
        setListener($cards(), 'click', (event) => clearAndMove(cardClicked, event));
        $.querySelector('#prev').addEventListener('click', () => clearAndMove(prevCard), false);
        $.querySelector('#next').addEventListener('click', () => clearAndMove(nextCard), false);

        $.querySelector('#contentCard').addEventListener('mousedown', (event) => clearAndMove(onMoveDrag, event), false);
    }

    const nextCard = (event, index = 1) => {
        if(index <= 0 ) return;
        const $card = $cards()[getActualIndex() + index] || $cards()[-1 + index];
        selectCard($card);
    }
    
    const prevCard = () => {
        const $card = $cards()[getActualIndex() + -1] || Array.prototype.slice.call($cards(), -1);
        selectCard($card);
    }
    const setLoopCards = () => {
        _loopCards = setInterval(nextCard, 3000);
    }

    const start = () => {
        setListeners();
        setTotalCards();
        setInitStyles();
        // setLoopCards();
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
