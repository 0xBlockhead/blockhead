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
				label: 'icon/header image',
			},
			{
				label: 'display name',
			},
			'acct',
		],
		content: {
			dl: [
				[
					'acct',
					{
						label: 'ActivityStreams URI',
					},
					{
						label: 'instance origin',
					},
					{
						label: 'local account id',
					},
					{
						label: 'created date',
					},
				],
				[
					{
						label: 'profile URL',
					},
					{
						label: 'bot/locked flags',
					},
					{
						label: 'latest follower/following/status counters',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Profile',
					items: [
						{
							label: 'display name',
						},
						'note',
						{
							label: 'icon',
						},
						{
							label: 'header image',
						},
						'website',
						{
							label: 'profile URL',
						},
					],
				},
				{
					label: 'Metric snapshots',
					items: [
						{
							label: 'timestamped follower/following/status counters',
						},
					],
				},
				{
					label: 'Outbox',
					items: [
						{
							label: 'note rows authored by this actor',
						},
					],
				},
				{
					label: 'Federation identity',
					items: [
						{
							label: 'ActivityStreams URI',
						},
						{
							label: 'instance origin',
						},
						{
							label: 'local account id',
						},
						{
							label: 'acct selector',
						},
						{
							label: 'WebFinger link evidence',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'Mastodon/Fedi account id lookup',
						},
						{
							label: 'acct lookup',
						},
						{
							label: 'ActivityStreams URI search/dereference',
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubActor>
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
	entityType={EntityType.ActivityPubActor}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
