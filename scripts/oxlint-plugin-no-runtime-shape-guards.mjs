/** oxlint JS plugin: ban runtime shape guards (see AGENTS.md → Linting). */

const message = (
	'Runtime shape guard (`typeof` unary, `Array.isArray`, `Reflect.get`). '
	+ 'Fix upstream types or narrow at a documented wire boundary (`$/typescript/JsonValue.ts`, EIP modules). '
	+ 'Otherwise `oxlint-disable-next-line` with a one-line reviewer-verifiable reason, or a scoped override in `.oxlintrc.json`.'
)

const envTypeofTargets = new Set([
	'window',
	'document',
	'globalThis',
])

const rootMemberIdentifierName = (node) => {
	if (node.type !== 'MemberExpression') return null
	let o = node
	while (o.type === 'MemberExpression') o = o.object
	return o.type === 'Identifier' ? o.name : null
}

const isReflectGetCall = (callee) => (
	callee?.type === 'MemberExpression'
	&& callee.object?.type === 'Identifier'
	&& callee.object.name === 'Reflect'
	&& !callee.optional
	&& (
		(
			callee.property.type === 'Identifier'
			&& callee.property.name === 'get'
			&& !callee.computed
		)
		|| (
			callee.computed
			&& callee.property.type === 'Literal'
			&& callee.property.value === 'get'
		)
	)
)

const isArrayIsArrayCall = (callee) => (
	callee?.type === 'MemberExpression'
	&& callee.object?.type === 'Identifier'
	&& callee.object.name === 'Array'
	&& !callee.optional
	&& (
		(
			callee.property.type === 'Identifier'
			&& callee.property.name === 'isArray'
			&& !callee.computed
		)
		|| (
			callee.computed
			&& callee.property.type === 'Literal'
			&& callee.property.value === 'isArray'
		)
	)
)

const rule = {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow typeof unary, Array.isArray, Reflect.get for TS shape workarounds' },
	},
	create(context) {
		return {
			UnaryExpression(node) {
				if (node.operator !== 'typeof') return
				const { argument } = node
				if (
					argument.type === 'Identifier'
					&& envTypeofTargets.has(argument.name)
				) return
				if (
					argument.type === 'MemberExpression'
					&& envTypeofTargets.has(rootMemberIdentifierName(argument))
				) return

				context.report({ node, message })
			},
			CallExpression(node) {
				if (isReflectGetCall(node.callee) || isArrayIsArrayCall(node.callee)) {
					context.report({ node, message })
				}
			},
		}
	},
}

export default {
	meta: {
		name: 'no-runtime-shape-guards',
	},
	rules: {
		guards: rule,
	},
}
