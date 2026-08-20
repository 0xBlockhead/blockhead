import { describe, expect, it } from 'vitest'

import {
	entityFieldAddressKey,
	entityFieldDefinitions,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schemaMeta } from '$/schema/index.ts'


type DriftFinding = {
	category:
		| 'missing-row-current-probe'
		| 'selector-drift'
		| 'missing-field'
		| 'reference-target-drift'
		| 'cardinality-drift'
		| 'timestamp-source-drift'
		| 'axis-violation'
		| 'migration-debt'
	entityType: string
	detail: string
	fieldName?: string
}


type RequiredRef = {
	name: string
	entityType: string
	fieldType: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
	cardinality?: EntityFieldCardinality
}


type IntentEntityContract = {
	entityType: string
	selectorFields: readonly (readonly string[])[]
	requiredFields: readonly string[]
	requiredRefs: readonly RequiredRef[]
	timestampSource?: boolean
	parentArtifact?: boolean
}


const firstSliceContract = [
	{
		entityType: EntityType.BlockheadIntentInvocation,
		selectorFields: [
			[
				'sessionId',
				'invocationId',
			],
		],
		requiredFields: [
			'sessionId',
			'invocationId',
			'modality',
			'createdAt',
		],
		requiredRefs: [
			{
				name: '$session',
				entityType: EntityType.BlockheadSession,
				fieldType: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: '$createdAction',
				entityType: EntityType.BlockheadSessionAction,
				fieldType: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		],
		parentArtifact: true,
	},
	{
		entityType: EntityType.BlockheadActionReadinessCheck,
		selectorFields: [
			[
				'sessionId',
				'actionId',
				'checkId',
			],
		],
		requiredFields: [
			'sessionId',
			'actionId',
			'checkId',
			'checkKind',
			'createdAt',
		],
		requiredRefs: [
			{
				name: '$sessionAction',
				entityType: EntityType.BlockheadSessionAction,
				fieldType: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: '$$timestamps',
				entityType: EntityType.BlockheadActionReadinessCheck_Timestamp,
				fieldType: EntityFieldType.EntitiesReference,
				cardinality: EntityFieldCardinality.Many,
			},
		],
		parentArtifact: true,
	},
	{
		entityType: EntityType.BlockheadActionReadinessCheck_Timestamp,
		selectorFields: [
			[
				'$readinessCheck',
				'timestampMs',
				'source',
			],
		],
		requiredFields: [
			'timestampMs',
			'source',
			'status',
		],
		requiredRefs: [
			{
				name: '$readinessCheck',
				entityType: EntityType.BlockheadActionReadinessCheck,
				fieldType: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.One,
			},
		],
		timestampSource: true,
	},
	{
		entityType: EntityType.BlockheadActionOutcome,
		selectorFields: [
			[
				'sessionId',
				'actionId',
				'outcomeId',
			],
		],
		requiredFields: [
			'sessionId',
			'actionId',
			'outcomeId',
			'outcomeKind',
			'createdAt',
		],
		requiredRefs: [
			{
				name: '$sessionAction',
				entityType: EntityType.BlockheadSessionAction,
				fieldType: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: '$$timestamps',
				entityType: EntityType.BlockheadActionOutcome_Timestamp,
				fieldType: EntityFieldType.EntitiesReference,
				cardinality: EntityFieldCardinality.Many,
			},
		],
		parentArtifact: true,
	},
	{
		entityType: EntityType.BlockheadActionOutcome_Timestamp,
		selectorFields: [
			[
				'$outcome',
				'timestampMs',
				'source',
			],
		],
		requiredFields: [
			'timestampMs',
			'source',
			'status',
		],
		requiredRefs: [
			{
				name: '$outcome',
				entityType: EntityType.BlockheadActionOutcome,
				fieldType: EntityFieldType.EntityReference,
				cardinality: EntityFieldCardinality.One,
			},
		],
		timestampSource: true,
	},
] as const satisfies readonly IntentEntityContract[]


const firstSliceIntegrationRefs = [
	{
		entityType: EntityType.BlockheadSession,
		ref: {
			name: '$$intentInvocations',
			entityType: EntityType.BlockheadIntentInvocation,
			fieldType: EntityFieldType.EntitiesReference,
			cardinality: EntityFieldCardinality.Many,
		} satisfies RequiredRef,
	},
	{
		entityType: EntityType.BlockheadSessionAction,
		ref: {
			name: '$originInvocation',
			entityType: EntityType.BlockheadIntentInvocation,
			fieldType: EntityFieldType.EntityReference,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		} satisfies RequiredRef,
	},
	{
		entityType: EntityType.BlockheadSessionAction,
		ref: {
			name: '$$readinessChecks',
			entityType: EntityType.BlockheadActionReadinessCheck,
			fieldType: EntityFieldType.EntitiesReference,
			cardinality: EntityFieldCardinality.Many,
		} satisfies RequiredRef,
	},
	{
		entityType: EntityType.BlockheadSessionAction,
		ref: {
			name: '$$outcomes',
			entityType: EntityType.BlockheadActionOutcome,
			fieldType: EntityFieldType.EntitiesReference,
			cardinality: EntityFieldCardinality.Many,
		} satisfies RequiredRef,
	},
] as const


const forbiddenAntiFieldNames = [
	'DataTransfer',
	'dataTransfer',
	'dragPayload',
	'dropPayload',
	'browserDropPayload',
	'rawDragPayload',
	'orderStatus',
	'providerOrderStatus',
	'walletStatus',
	'walletSuccess',
	'balance',
	'allowance',
	'walletAuthority',
	'walletCapability',
	'receipt',
	'$$receipts',
	'$receipt',
	'$$publicLogs',
	'$$evmLogs',
] as const


const parentForbiddenFinalityFields = [
	'finality',
	'walletStatus',
	'walletSuccess',
	'orderStatus',
	'providerOrderStatus',
	'status',
] as const


const canonicalPublicTargets = new Set([
	EntityType.EvmTransaction,
	EntityType.EvmLog,
])


const rootField = (
	entityType: string,
	fieldName: string
) => (
	schemaMeta.entityFieldDefinitionByEntityTypePathAndName[entityType]?.[
		entityFieldAddressKey(entityType, [], fieldName)
	]
)

const assertRef = (
	entityType: string,
	requiredRef: RequiredRef,
	findings: DriftFinding[]
) => {
	const fieldDefinition = rootField(entityType, requiredRef.name)
	if (fieldDefinition == null) {
		findings.push({
			category: 'missing-field',
			entityType,
			fieldName: requiredRef.name,
			detail: `missing required ref ${requiredRef.name}`,
		})
		return
	}

	if (fieldDefinition.type !== requiredRef.fieldType) {
		findings.push({
			category: 'reference-target-drift',
			entityType,
			fieldName: requiredRef.name,
			detail: `expected ${requiredRef.fieldType}, got ${fieldDefinition.type}`,
		})
		return
	}

	if (
		(
			fieldDefinition.type === EntityFieldType.EntityReference
			|| fieldDefinition.type === EntityFieldType.EntitiesReference
		)
		&& fieldDefinition.entityType !== requiredRef.entityType
	) {
		findings.push({
			category: 'reference-target-drift',
			entityType,
			fieldName: requiredRef.name,
			detail: `expected target ${requiredRef.entityType}, got ${fieldDefinition.entityType}`,
		})
	}

	if (
		requiredRef.cardinality != null
		&& fieldDefinition.cardinality !== requiredRef.cardinality
	) {
		findings.push({
			category: 'cardinality-drift',
			entityType,
			fieldName: requiredRef.name,
			detail: `expected ${requiredRef.cardinality}, got ${fieldDefinition.cardinality}`,
		})
	}
}


const collectFirstSliceDrift = () => {
	const findings: DriftFinding[] = []

	for (const contract of firstSliceContract) {
		const entityDefinition = schemaMeta.entityDefinitionByType[contract.entityType]
		const liveSelectorFieldSets = entityDefinition.selectors.map((selector) => [
			...selector.fields,
		])
		const missingSelectors = contract.selectorFields.filter((requiredFields) => (
			!liveSelectorFieldSets.some((liveFields) => (
				liveFields.length === requiredFields.length
				&& liveFields.every((fieldName, index) => fieldName === requiredFields[index])
			))
		))
		for (const selectorFields of missingSelectors) {
			findings.push({
				category: 'selector-drift',
				entityType: contract.entityType,
				detail: `missing selector fields [${selectorFields.join('+')}]`,
			})
		}

		for (const fieldName of contract.requiredFields) {
			if (rootField(contract.entityType, fieldName) == null) {
				findings.push({
					category: 'missing-field',
					entityType: contract.entityType,
					fieldName,
					detail: `missing required field ${fieldName}`,
				})
			}
		}

		for (const requiredRef of contract.requiredRefs)
			assertRef(contract.entityType, requiredRef, findings)

		if (contract.timestampSource) {
			const sourceInSelector = entityDefinition.selectors.some((selector) => (
				selector.fields.includes('source')
			))
			const sourceField = rootField(contract.entityType, 'source')
			if (!sourceInSelector) {
				findings.push({
					category: 'timestamp-source-drift',
					entityType: contract.entityType,
					fieldName: 'source',
					detail: 'timestamp selector missing source',
				})
			}
			if (sourceField == null) {
				findings.push({
					category: 'timestamp-source-drift',
					entityType: contract.entityType,
					fieldName: 'source',
					detail: 'timestamp row missing source field',
				})
			} else if (sourceField.cardinality !== EntityFieldCardinality.One) {
				findings.push({
					category: 'timestamp-source-drift',
					entityType: contract.entityType,
					fieldName: 'source',
					detail: `source cardinality expected One, got ${sourceField.cardinality}`,
				})
			}
		}

		if (contract.parentArtifact) {
			for (const fieldName of parentForbiddenFinalityFields) {
				if (
					fieldName === 'status'
					&& (
						contract.entityType === EntityType.BlockheadActionReadinessCheck
						|| contract.entityType === EntityType.BlockheadActionOutcome
					)
				) {
					const statusField = rootField(contract.entityType, fieldName)
					if (statusField != null) {
						findings.push({
							category: 'axis-violation',
							entityType: contract.entityType,
							fieldName,
							detail: 'mutable observation status on parent local artifact',
						})
					}
					continue
				}

				if (
					fieldName !== 'status'
					&& rootField(contract.entityType, fieldName) != null
				) {
					findings.push({
						category: 'axis-violation',
						entityType: contract.entityType,
						fieldName,
						detail: `parent local artifact stores forbidden ${fieldName}`,
					})
				}
			}
		}

		for (const fieldDefinition of entityFieldDefinitions(entityDefinition)) {
			if ((forbiddenAntiFieldNames as readonly string[]).includes(fieldDefinition.name)) {
				findings.push({
					category: 'axis-violation',
					entityType: contract.entityType,
					fieldName: fieldDefinition.name,
					detail: `forbidden anti-field ${fieldDefinition.name}`,
				})
			}

			if (
				(
					fieldDefinition.type === EntityFieldType.EntityReference
					|| fieldDefinition.type === EntityFieldType.EntitiesReference
				)
				&& canonicalPublicTargets.has(fieldDefinition.entityType)
			) {
				findings.push({
					category: 'axis-violation',
					entityType: contract.entityType,
					fieldName: fieldDefinition.name,
					detail: `canonical public ${fieldDefinition.entityType} linked from first-slice local artifact`,
				})
			}
		}
	}

	for (const { entityType, ref } of firstSliceIntegrationRefs) {
		assertRef(entityType, ref, findings)
	}

	return findings
		.slice()
		.sort((left, right) => (
			left.category === right.category ?
				left.entityType === right.entityType ?
					(left.fieldName ?? '').localeCompare(right.fieldName ?? '')
				:
					left.entityType.localeCompare(right.entityType)
			:
				left.category.localeCompare(right.category)
		))
}


const knownLiveAxisViolations = [
	{
		category: 'axis-violation',
		entityType: EntityType.BlockheadActionOutcome,
		fieldName: '$$evmTransactions',
		detail: 'canonical public EvmTransaction linked from first-slice local artifact',
	},
] as const satisfies readonly DriftFinding[]


describe('Blockhead first-slice intent schema drift gate', () => {
	it('registers tracked first-slice rows with contract selectors', () => {
		for (const contract of firstSliceContract) {
			const entityDefinition = schemaMeta.entityDefinitionByType[contract.entityType]
			expect(
				entityDefinition,
				`missing-row-current-probe: ${contract.entityType}`
			).toBeDefined()
			const liveSelectorFieldSets = entityDefinition.selectors.map((selector) => [
				...selector.fields,
			])
			for (const selectorFields of contract.selectorFields) {
				expect(
					liveSelectorFieldSets,
					`selector-drift: ${contract.entityType} [${selectorFields.join('+')}]`
				).toEqual(
					expect.arrayContaining([
						selectorFields,
					])
				)
			}
		}
	})

	it('keeps first-slice integration refs on session and session action', () => {
		for (const { entityType, ref } of firstSliceIntegrationRefs) {
			const fieldDefinition = rootField(entityType, ref.name)
			expect(
				fieldDefinition,
				`missing-field: ${entityType}.${ref.name}`
			).toMatchObject({
				type: ref.fieldType,
				entityType: ref.entityType,
					cardinality: ref.cardinality,
			})
		}
	})

	it('keeps source on every first-slice timestamp selector and field', () => {
		for (const contract of firstSliceContract.filter((row) => row.timestampSource)) {
			const entityDefinition = schemaMeta.entityDefinitionByType[contract.entityType]
			expect(entityDefinition).toBeDefined()
			expect(
				entityDefinition.selectors.some((selector) => selector.fields.includes('source')),
				`timestamp-source-drift: ${contract.entityType} selector`
			).toBe(true)
			expect(
				rootField(contract.entityType, 'source'),
				`timestamp-source-drift: ${contract.entityType} field`
			).toMatchObject({
				type: EntityFieldType.Primitive,
				cardinality: EntityFieldCardinality.One,
			})
		}
	})

	it('forbids tracked anti-field names on first-slice rows', () => {
		const antiFieldHits = firstSliceContract.flatMap((contract) => {
			const entityDefinition = schemaMeta.entityDefinitionByType[contract.entityType]
			return entityFieldDefinitions(entityDefinition)
				.filter((fieldDefinition) => (
					(forbiddenAntiFieldNames as readonly string[]).includes(fieldDefinition.name)
				))
				.map((fieldDefinition) => `${contract.entityType}.${fieldDefinition.name}`)
		})

		expect(antiFieldHits).toEqual([])
	})

	it('reports live first-slice contradictions without editing schema', () => {
		const findings = collectFirstSliceDrift()
		const blockingFindings = findings.filter((finding) => (
			finding.category !== 'axis-violation'
			|| !knownLiveAxisViolations.some((known) => (
				known.entityType === finding.entityType
				&& known.fieldName === finding.fieldName
				&& known.detail === finding.detail
			))
		))
		const axisViolations = findings.filter((finding) => finding.category === 'axis-violation')

		expect(blockingFindings).toEqual([])
		expect(axisViolations).toEqual([
			...knownLiveAxisViolations,
		])
	})
})
