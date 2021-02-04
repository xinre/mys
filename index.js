const channel = () => {
    let taker;
    const take = (agu) => {
        taker = agu;
    };
    const put = (agu) => {
        if (taker) {
            const nowTaker = taker;
            taker = null;
            console.log(agu, 'put');
            nowTaker(agu);
        }
    };
    return {
        put,
        take
    };
};
const livingChan = channel();
const take = () => {
    return {
        type: 'take'
    };
};
function* takeEvery(worker) {
    yield fork(function* () {
        while (true) {
            const action = yield take();
            worker(action);
        }
    });
}
function fork(cb) {
    return {
        type: 'fork',
        fn: cb,
    };
}
function runForkEffect(effect, cb) {
    task(effect.fn || effect);
    cb();
}
function* mainSaga() {
    const action = yield take();
    console.log(action, '000');
    // yield takeEvery(action => {
    //   console.log(action, '66666')
    // })
}
const task = (iterator) => {
    const iterVariable = typeof iterator === 'function' && iterator();
    let a = '****';
    function next(args) {
        const result = iterVariable.next(args);
        console.log(a);
        console.log(args, result, 'pppp', iterVariable);
        if (!result.done) {
            const effect = result.value;
            if (typeof effect[Symbol.iterator] === 'function') {
                runForkEffect(effect, next);
            }
            else if (effect.type) {
                switch (effect.type) {
                    case 'take':
                        runTakeEffect(next);
                        break;
                    case 'fork':
                        runForkEffect(effect, next);
                        break;
                    default:
                }
            }
        }
    }
    next();
};
function runTakeEffect(next) {
    console.log(next, '====');
    livingChan.take(input => {
        next(input);
    });
}
task(mainSaga);
let count = 0;
function test() {
    const action = `action${count++}`;
    livingChan.put(action);
}
test();
