const unit = {
    attack : function(weapon) {
        return `${weapon}으로 공격한다.`;
    }
}

console.log(unit.attack("주먹"));
console.log(unit.attack("총"));