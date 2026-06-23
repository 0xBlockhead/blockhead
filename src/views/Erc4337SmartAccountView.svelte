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
			'address',
			{
				label: 'factory',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'address',
					{
						label: 'factory',
					},
					{
						label: 'account contract',
					},
					{
						label: 'latest indexed user-operation count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'User operations',
					items: [
						{
							label: 'user operations whose sender resolves to this account',
						},
					],
				},
				{
					label: 'Factory',
					items: [
						{
							label: 'linked ERC-4337 account factory',
						},
					],
				},
				{
					label: 'Contract',
					items: [
						{
							label: 'smart-account EVM contract',
						},
					],
				},
				{
					label: 'Network account',
					items: [
						{
							label: 'underlying EVM network account',
						},
					],
				},
				{
					label: 'Count snapshots',
					items: [
						{
							label: 'timestamped smart-account count observations',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent EVM network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Blockscout smart-account detail/list payload',
						},
						{
							label: 'pagination context',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337SmartAccount>
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
	entityType={EntityType.Erc4337SmartAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
