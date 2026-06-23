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
				label: 'document',
			},
			{
				label: 'claim path',
			},
			{
				label: 'claim kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'document',
					},
					{
						label: 'extractor id',
					},
					{
						label: 'claim path',
					},
					{
						label: 'claim kind',
					},
					{
						label: 'metadata key',
					},
				],
				[
					{
						label: 'format object',
					},
					{
						label: 'checksum',
					},
					{
						label: 'subject kind/selector',
					},
					{
						label: 'relationship kind',
					},
					{
						label: 'normalized selector',
					},
					'confidence',
					'value',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Document',
					items: [
						{
							label: 'AiDocument',
						},
					],
				},
				{
					label: 'Value',
					items: [
						{
							label: 'claim value JSON',
						},
					],
				},
				{
					label: 'Subject',
					items: [
						{
							label: 'subject selector',
						},
					],
				},
				{
					label: 'Normalized',
					items: [
						{
							label: 'metadata key',
						},
						{
							label: 'format object id/kind',
						},
						{
							label: 'relationship kind',
						},
						{
							label: 'normalized selector',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiDocumentClaim>
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
	entityType={EntityType.AiDocumentClaim}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
