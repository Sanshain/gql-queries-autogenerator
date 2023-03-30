export default function gql(
	stroke: ReadonlyArray<string>, ...args: Array<string | number | boolean>): any {

	return stroke.reduce((prev, cur, i: number) => {

		return (prev + args[i - 1] + cur)
	});
}

