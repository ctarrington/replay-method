"use strict";

const test = require('tape');
var fse = require('fs-extra');

const replay = require('../lib/replay-method');

function createFunction() {
    const theFunction = function(greeting, person) {
        theFunction.callCount++;
        return `${greeting}, ${person.name}`;
    }
    theFunction.callCount = 0;

    return theFunction;
}

test('simple function', function(t) {
    t.plan(2);
    const greet = createFunction();
    const message = greet('Hi', {name: 'Fred'});
    t.equal('Hi, Fred', message);
    t.equal(1, greet.callCount);
});

test('wrapped function, no data', function(t) {
    const DATA_PATH = './data/function';
    fse.removeSync(DATA_PATH);

    t.plan(2);
    const greet = createFunction();
    const message = greet('Hi', {name: 'Ted'});
    t.equal('Hi, Ted', message);
    t.equal(1, greet.callCount);
    message = greet('Hi', {name: 'Ted'});
    t.equal('Hi, Ted', message);
    t.equal(2, greet.callCount);

    const wrappedGreet = replay.wrapFunction(greet);
    message = wrappedGreet('Yo', {name: 'Bob'});
    t.equal('Yo, Bob', message);
    t.equal(3, greet.callCount);
    message = wrappedGreet('Yo', {name: 'Bob'});
    t.equal('Yo, Bob', message);
    t.equal(3, greet.callCount);

    message = wrappedGreet('Hiya', {name: 'Bob'});
    t.equal('Hiya, Bob', message);
    t.equal(4, greet.callCount);

    message = wrappedGreet('Hiya', {name: 'Bob'});
    t.equal('Hiya, Bob', message);
    t.equal(4, greet.callCount);
    
});