import { type as arktype } from 'arktype'

const lensRuleIdWire = arktype('string > 0')
const lensRuleAddressWire = arktype(/^0x[0-9a-f]{40}$/i)
const lensRuleConfigurationWire = arktype('unknown[]')

export const lensFeedRuleWire = arktype({
	id: lensRuleIdWire,
	type: "'TOKEN_GATED' | 'RESTRICTED_SIGNERS' | 'ACCOUNT_BLOCKING' | 'SIMPLE_PAYMENT' | 'GROUP_GATED' | 'UNKNOWN'",
	address: lensRuleAddressWire,
	executesOn: arktype("'CREATING_POST' | 'EDITING_POST' | 'DELETING_POST' | 'CHANGING_POST_RULE'").array(),
	config: lensRuleConfigurationWire,
}).onUndeclaredKey('delete')

export type LensFeedRule = typeof lensFeedRuleWire.infer

export const lensFeedRulesWire = arktype({
	required: lensFeedRuleWire.array(),
	anyOf: lensFeedRuleWire.array(),
}).onUndeclaredKey('delete')

export type LensFeedRules = typeof lensFeedRulesWire.infer

export const lensUsernameNamespaceRuleWire = arktype({
	id: lensRuleIdWire,
	type: "'TOKEN_GATED' | 'PRICE_PER_LENGTH' | 'USERNAME_LENGTH' | 'USERNAME_RESERVED' | 'USERNAME_SIMPLE_CHARSET' | 'UNKNOWN'",
	address: lensRuleAddressWire,
	executesOn: arktype("'CREATING' | 'REMOVING' | 'ASSIGNING' | 'UNASSIGNING'").array(),
	config: lensRuleConfigurationWire,
}).onUndeclaredKey('delete')

export type LensUsernameNamespaceRule = typeof lensUsernameNamespaceRuleWire.infer

export const lensUsernameNamespaceRulesWire = arktype({
	required: lensUsernameNamespaceRuleWire.array(),
	anyOf: lensUsernameNamespaceRuleWire.array(),
}).onUndeclaredKey('delete')

export type LensUsernameNamespaceRules = typeof lensUsernameNamespaceRulesWire.infer
