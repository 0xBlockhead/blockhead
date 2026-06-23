<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'network',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'current cent/HBAR equivalents',
					},
					{
						label: 'current expiration',
					},
					{
						label: 'next cent/HBAR equivalents',
					},
					{
						label: 'next expiration',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent Hedera network',
						},
					],
				},
				{
					label: 'Current rate',
					items: [
						{
							label: 'current exchange-rate fields',
						},
					],
				},
				{
					label: 'Next rate',
					items: [
						{
							label: 'next exchange-rate fields',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'network exchange-rate payload',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkExchangeRate_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
