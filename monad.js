
class Monad{

	funcs = []
	objects = []

	constructor(objects, funcs){
		super();
		this.objects = objects;
		this.funcs = funcs;		
	}

	add(func){
		this.funcs.push(func);
		return this.funcs;
	}

	apply(){
		let result = null;
		for (const func of this.funcs) {
			result = func(result ?? this.objects)
		}
		return result;
	}

}

module.exports = { Monad }