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
			label: 'message',
		},
		{
			label: 'part index',
		},
		{
			label: 'part kind',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'message',
				},
				{
					label: 'part index',
				},
				{
					label: 'kind',
				},
				{
					label: 'mime type',
				},
			],
			[
				{
					label: 'text/uri/payload',
				},
				{
					label: 'artifact ref',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Message',
				items: [
					{
						label: 'AcpMessage',
					},
				],
			},
			{
				label: 'Artifact',
				items: [
					{
						label: 'AiArtifact when materialized',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpMessagePart>
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
	entityType={EntityType.AcpMessagePart}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
