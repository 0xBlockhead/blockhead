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
				label: 'account',
			},
			{
				label: 'token',
			},
			{
				label: 'observation time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'token',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'block height',
					},
					'standard',
					'balance',
					{
						label: 'owned serial count',
					},
					{
						label: 'frozen balance',
					},
					{
						label: 'delegated balance',
					},
					{
						label: 'token metadata snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'holder account identity',
						},
					],
				},
				{
					label: 'Token',
					items: [
						{
							label: 'token identity',
						},
					],
				},
				{
					label: 'Transfers',
					items: [
						{
							label: 'token transfers for the account/token when indexed',
						},
					],
				},
				{
					label: 'Serial holdings',
					items: [
						{
							label: 'owned serial numbers for NFT standards',
						},
					],
				},
				{
					label: 'Resource context',
					items: [
						{
							label: 'TRC-10 asset bandwidth maps when sourced',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'account-token/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronAccountTokenBalance_Timestamp>
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
	entityType={EntityType.TronAccountTokenBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
