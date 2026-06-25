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
		'$repository',
		'eventId',
		'eventKind',
	],
	content: {
		dl: [
			[
				'$repository',
				'eventId',
				'eventKind',
				'authorDid',
				'subjectSelector',
			],
			[
				'timestampMs',
				'verificationStatus',
				{
					label: 'payload hash/object id',
				},
				'$gitCommit',
				'$payloadObject',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Radicle repository',
					},
				],
			},
			{
				label: 'Subject',
				items: [
					{
						label: 'issue/patch/comment by selector',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'Git object or commit payload',
					},
				],
			},
			{
				label: 'Timeline',
				items: [
					{
						label: 'sibling events for the same subject',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleCollaborationEvent>
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
	entityType={EntityType.RadicleCollaborationEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
