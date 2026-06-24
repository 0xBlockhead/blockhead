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
			label: 'relay URL',
		},
		{
			label: 'latest relay snapshot',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'relay URL',
				},
				{
					label: 'latest relay snapshot',
				},
				'name',
				{
					label: 'software/version',
				},
				{
					label: 'supported NIP count',
				},
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
