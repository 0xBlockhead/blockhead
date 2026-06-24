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
			label: 'transport session id',
		},
		{
			label: 'transport kind',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'transport session id',
				},
				{
					label: 'transport kind',
				},
				{
					label: 'session kind',
				},
				'status',
				'topic',
				{
					label: 'peer id',
				},
			],
			[
				{
					label: 'relay protocol',
				},
				{
					label: 'bridge URL',
				},
				{
					label: 'manifest URL',
				},
				'origin',
				{
					label: 'device id',
				},
				{
					label: 'created/updated/expires timestamps',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Connection',
				items: [
					{
						label: 'BlockheadWalletConnection',
					},
				],
			},
			{
				label: 'Transport metadata',
				items: [
					{
						label: 'redacted metadata JSON',
					},
				],
			},
			{
				label: 'Lifecycle',
				items: [
					{
						label: 'created/updated/expires/status',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletTransportSession>
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
	entityType={EntityType.BlockheadWalletTransportSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
