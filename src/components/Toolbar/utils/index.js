export function setReverseValue(setter, key) {
    setter(prev => {
        if(!prev[key]) {
            for(let i in prev) {
                 prev[i] = false;
            }
            prev[key] = true;
        }else {
            prev[key] = false;
        }
        return {...prev};
    })

}