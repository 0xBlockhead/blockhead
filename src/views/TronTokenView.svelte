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
				label: 'token id',
			},
			'standard',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'token id',
					},
					'standard',
					{
						label: 'owner',
					},
					{
						label: 'contract',
					},
					{
						label: 'creation timestamp',
					},
					{
						label: 'latest metadata/supply/holder/transfer summary',
					},
					{
						label: 'latest observation time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Token observations',
					items: [
						{
							label: 'token metadata and metric observations',
						},
					],
				},
				{
					label: 'Account balances',
					items: [
						{
							label: 'account-token balance observations when source-scoped',
						},
					],
				},
				{
					label: 'Contract',
					items: [
						{
							label: 'contract identity when contract-backed',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'owner account identity',
						},
					],
				},
				{
					label: 'Transfers',
					items: [
						{
							label: 'token transfers when scoped by transaction/account source context',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronToken>
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
	entityType={EntityType.TronToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
