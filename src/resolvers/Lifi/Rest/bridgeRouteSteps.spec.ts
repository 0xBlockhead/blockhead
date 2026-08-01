import {
	describe,
	expect,
	it,
} from 'vitest'

import { materializeResolverOutput, ResolverOutputMaterialization } from '$/collections/assertLoadedCollectionRows.ts'
import { bridgeRouteStepSnapshotFromLifiQuoteStep } from '$/resolvers/Lifi/Rest/bridgeRouteSteps.ts'
import { EntityMetaKey, entitySelectorKey, indexSchema } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


describe('LI.FI bridge route step references', () => {
	it('uses schema-valid CAIP-2 selectors for nested network and token references', () => {
		const step = bridgeRouteStepSnapshotFromLifiQuoteStep(
			{
				fromChainId: 1,
				toChainId: 10,
				fromToken: '0x0000000000000000000000000000000000000000',
				toToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				fromAmount: 1n,
				fromAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				slippage: 0.005,
				toAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
			0,
			{
				id: 'step-0',
				type: 'cross',
				tool: 'across',
				action: {
					fromChainId: 1,
					toChainId: 10,
					fromAmount: '1',
					fromToken: {
						address: '0x0000000000000000000000000000000000000000',
						chainId: 1,
						decimals: 18,
						name: 'Ether',
						symbol: 'ETH',
					},
					toToken: {
						address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						chainId: 10,
						decimals: 6,
						name: 'USD Coin',
						symbol: 'USDC',
					},
				},
				estimate: {
					tool: 'across',
					fromAmount: '1',
					toAmount: '1',
					toAmountMin: '1',
					executionDuration: 30,
				},
			}
		)
		const schemaIndex = indexSchema(schema)
		const entityDefinitionByType = schemaIndex.entityDefinitionByType
		const stepSelector = step[EntityMetaKey.Selector]

		for (const fieldName of [
			'$fromNetwork',
			'$toNetwork',
			'$fromToken',
			'$toToken',
		] as const) {
			const fieldDefinition = entityDefinitionByType[EntityType.BridgeRouteStep].fields
				.find((field) => field.name === fieldName)
			if (fieldDefinition == null)
				throw new Error(`Missing BridgeRouteStep.${fieldName}`)

			expect(() => materializeResolverOutput({
				kind: ResolverOutputMaterialization.Field,
				schema,
				schemaIndex,
				entityDefinition: entityDefinitionByType[EntityType.BridgeRouteStep],
				parentSelector: stepSelector,
				parentSelectorKey: entitySelectorKey(
					schema,
					entityDefinitionByType[EntityType.BridgeRouteStep],
					stepSelector
				),
				source: 'Lifi_Rest',
				fieldDefinition,
				value: step[fieldName],
			})).not.toThrow()
		}
	})
})
