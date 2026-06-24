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
			label: 'federation',
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
					label: 'federation',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'reachability',
				},
				'health',
				{
					label: 'gateway count',
				},
				{
					label: 'config hash',
				},
				{
					label: 'module config hash',
				},
				{
					label: 'meta presence',
				},
				{
					label: 'invite-code observation flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Federation',
				items: [
					{
						label: 'parent Fedimint federation',
					},
				],
			},
			{
				label: 'Peers',
				items: [
					'peerStatusJson',
				],
			},
			{
				label: 'Meta',
				items: [
					'metaJson',
				],
			},
			{
				label: 'Gateways',
				items: [
					{
						label: 'gateway count',
					},
					{
						label: 'discovered gateway refs',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'connected client/gateway endpoint',
					},
					{
						label: 'invite-code preview context',
					},
					{
						label: 'errors',
					},
					{
						label: 'freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintFederation_Timestamp>
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
	entityType={EntityType.FedimintFederation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
