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
		'relayUrl',
		{
			label: 'latest relay snapshot',
		},
	],
	content: {
		dl: [
			[
				'relayUrl',
				{
					label: 'latest relay snapshot',
				},
				'name',
				{
					label: 'software/version',
				},
				'supportedNipCount',
				{
					label: 'paid flag',
				},
				'limit',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Snapshots',
				items: [
					{
						label: 'timestamped relay metadata/activity observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'seed',
					},
					{
						label: 'NIP-11 HTTP document',
					},
					{
						label: 'NostrBand relay-list payload',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'NostrNetwork browse context',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrRelay>
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
	entityType={EntityType.NostrRelay}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
