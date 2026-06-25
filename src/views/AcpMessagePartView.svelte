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
		'$message',
		'partIndex',
		'partKind',
	],
	content: {
		dl: [
			[
				'$message',
				'partIndex',
				'partKind',
				'mimeType',
			],
			[
				{
					label: 'text/uri/payload',
				},
				'$artifact',
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
