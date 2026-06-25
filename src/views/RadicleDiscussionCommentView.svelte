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
		'discussionSelector',
		'commentId',
		'authorDid',
	],
	content: {
		dl: [
			[
				'discussionSelector',
				'commentId',
				'authorDid',
				{
					label: 'created/updated timestamps',
				},
				{
					label: 'reply target',
				},
			],
			[
				'body',
				'bodyObjectId',
				'$payloadObject',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent discussion',
				items: [
					{
						label: 'Radicle issue or patch by selector',
					},
				],
			},
			{
				label: 'Replies',
				items: [
					{
						label: 'reply comment rows',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'Git object when body is object-backed',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleDiscussionComment>
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
	entityType={EntityType.RadicleDiscussionComment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
