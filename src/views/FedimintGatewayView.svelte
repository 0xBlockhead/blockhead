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
				label: 'gateway id',
			},
			{
				label: 'API URL',
			},
			{
				label: 'node pubkey',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'gateway id',
					},
					{
						label: 'API URL',
					},
					{
						label: 'node pubkey',
					},
					{
						label: 'latest Lightning alias',
					},
					{
						label: 'latest version',
					},
					{
						label: 'latest routing-fee summary',
					},
					{
						label: 'connected federation count',
					},
					{
						label: 'latest liquidity/health status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Federations',
					items: [
						{
							label: 'Fedimint federations known to this gateway',
						},
					],
				},
				{
					label: 'Latest state',
					items: [
						{
							label: 'latest gateway operational observation',
						},
					],
				},
				{
					label: 'Observations',
					items: [
						{
							label: 'timestamped gateway operational observations',
						},
					],
				},
				{
					label: 'Lightning',
					items: [
						{
							label: 'node pubkey',
						},
						{
							label: 'alias',
						},
						{
							label: 'channels',
						},
						{
							label: 'fee settings when source-backed',
						},
					],
				},
				{
					label: 'Management',
					items: [
						{
							label: 'admin-only config fields only in trusted local contexts',
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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintGateway>
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
	entityType={EntityType.FedimintGateway}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
