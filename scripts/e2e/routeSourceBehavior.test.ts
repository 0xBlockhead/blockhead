import assert from 'node:assert/strict'
import test from 'node:test'

import { deriveRouteSourceBehaviorByEntityType } from '../../tests/e2e/_routeSourceBehavior.ts'


const routeMetadata = (
	routedEntityTypes: readonly string[],
	sourceBehaviorByEntityType?: Readonly<Record<string, string>>
) => ({
	fixture: {
		routeId: '/example/[id=stringSegment]',
		routedEntityTypes,
		sourceBehaviorByEntityType,
	},
})


test('derives every accepted behavior from generated route metadata', () => {
	assert.deepEqual(
		deriveRouteSourceBehaviorByEntityType({
			...routeMetadata(['LocalEntity'], {
				LocalEntity: 'local-service-required',
			}),
			upstream: {
				routeId: '/upstream/[id=stringSegment]',
				routedEntityTypes: [
					'SupportedEntity',
					'UnsupportedEntity',
					'UnavailableEntity',
				],
				sourceBehaviorByEntityType: {
					SupportedEntity: 'supported',
					UnsupportedEntity: 'unsupported',
					UnavailableEntity: 'upstream-unavailable',
				},
			},
		}),
		{
			LocalEntity: 'local-service-required',
			SupportedEntity: 'supported',
			UnavailableEntity: 'upstream-unavailable',
			UnsupportedEntity: 'unsupported',
		}
	)
})

test('rejects missing source authority for a routed entity', () => {
	assert.throws(
		() => deriveRouteSourceBehaviorByEntityType(routeMetadata(['Example'])),
		/Example is missing explicit route source authority/
	)
})

test('rejects forbidden source authority', () => {
	assert.throws(
		() => deriveRouteSourceBehaviorByEntityType(routeMetadata(['Example'], {
			Example: 'deferred',
		})),
		/forbidden route source authority deferred/
	)
})

test('rejects ambiguous source authority across generated routes', () => {
	assert.throws(
		() => deriveRouteSourceBehaviorByEntityType({
			first: {
				routeId: '/example/[id=stringSegment]',
				routedEntityTypes: ['Example'],
				sourceBehaviorByEntityType: {
					Example: 'supported',
				},
			},
			second: {
				routeId: '/example/[id=stringSegment]/history',
				routedEntityTypes: ['Example'],
				sourceBehaviorByEntityType: {
					Example: 'upstream-unavailable',
				},
			},
		}),
		/ambiguous route source authority supported\/upstream-unavailable/
	)
})

test('rejects authority detached from routed entity metadata', () => {
	assert.throws(
		() => deriveRouteSourceBehaviorByEntityType(routeMetadata([], {
			Example: 'supported',
		})),
		/source authority is not attached to a routed entity/
	)
})
