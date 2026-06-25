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
		'$account',
		{
			label: 'claimed primary name',
		},
		{
			label: 'latest verified status',
		},
	],
	content: {
		dl: [
			[
				'$account',
				{
					label: 'claimed primary name',
				},
				{
					label: 'latest verified status',
				},
				{
					label: 'latest source',
				},
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Verification history',
				items: [
					{
						label: 'timestamped reverse-record verification observations',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'linked account/EVM account',
					},
				],
			},
			{
				label: 'Name',
				items: [
					{
						label: 'claimed ENS name',
					},
				],
			},
			{
				label: 'Resolver evidence',
				items: [
					{
						label: 'reverse node',
					},
					{
						label: 'forward-resolution check',
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsReverseRecord>
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
	entityType={EntityType.EnsReverseRecord}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
