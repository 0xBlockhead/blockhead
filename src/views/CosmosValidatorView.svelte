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
				label: 'operator address',
			},
			'moniker',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'operator address',
					},
					{
						label: 'consensus pubkey',
					},
					'moniker',
				],
				[
					{
						label: 'latest jailed/status/tokens snapshot',
					},
					{
						label: 'delegation count',
					},
					{
						label: 'description links',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Validator snapshots',
					items: [
						{
							label: 'timestamped validator stake/status observations',
						},
					],
				},
				{
					label: 'Delegations',
					items: [
						{
							label: 'delegations to this validator',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Cosmos network',
						},
					],
				},
				{
					label: 'Consensus identity',
					items: [
						{
							label: 'consensus pubkey',
						},
						{
							label: 'proposer mapping when source-backed',
						},
					],
				},
				{
					label: 'Description',
					items: [
						{
							label: 'identity/website/security-contact/details',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosValidator>
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
	entityType={EntityType.CosmosValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
