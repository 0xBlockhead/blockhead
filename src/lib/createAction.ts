import {
	type Action,
	type ActionType,
	actionTypeDefinitionByActionType,
} from '$/constants/actions.ts'

const bigintParamKeys = new Set([
	'amount',
])

const spreadDefined = (params: Record<string, unknown>) => (
	Object.fromEntries(
		Object.entries(params)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [
				key,
				bigintParamKeys.has(key) && (typeof value === 'string' || typeof value === 'number') ?
					BigInt(String(value))
				:
					value,
			]),
	)
)

export const createAction = <_ActionType extends ActionType>(
	actionType: _ActionType,
	params: Record<string, unknown> = {},
): Action => ({
	type: actionType,
	params: {
		...actionTypeDefinitionByActionType[actionType].params.assert({}),
		...spreadDefined(params),
	},
})

export const mergeActionParams = (action: Action): Action => (
	createAction(
		action.type,
		action.params,
	)
)
