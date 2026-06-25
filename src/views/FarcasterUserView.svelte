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
		'fid',
		'username',
		'displayName',
	],
	content: {
		dl: [
			[
				'fid',
				'username',
				'displayName',
				{
					label: 'icon URL/media',
				},
				'bio',
			],
			[
				'url',
				'$primaryEvmAccount',
				{
					label: 'verified address count',
				},
				{
					label: 'latest follower/following snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Casts',
				items: [
					{
						label: 'casts authored by this FID',
					},
				],
			},
			{
				label: 'Verified addresses',
				items: [
					{
						label: 'verified-address rows',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/following observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'verified-addresses',
			label: 'verified addresses',
			field: '$$verifiedAddresses',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'casts',
			label: 'casts',
			field: '$$casts',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterUser>
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
	entityType={EntityType.FarcasterUser}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
