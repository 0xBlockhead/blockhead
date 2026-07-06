import { registerHooks } from 'node:module'

const aliasTargets = [
	{
		alias: '$',
		target: '../../src/',
	},
]

registerHooks({
	resolve: (specifier, context, nextResolve) => {
		for (const { alias, target } of aliasTargets) {
			if (specifier === alias || specifier.startsWith(`${alias}/`))
				return {
					shortCircuit: true,
					url: new URL(
						specifier === alias ?
							target
						:
							`${target}${specifier.slice(alias.length + 1)}`,
						import.meta.url
					).href,
				}
		}

		return nextResolve(specifier, context)
	},
})
