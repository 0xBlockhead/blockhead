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
				label: 'client id/name',
			},
			{
				label: 'federation',
			},
			{
				label: 'mnemonic-set status',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'client id/name',
					},
					{
						label: 'federation',
					},
					{
						label: 'mnemonic-set status',
					},
					{
						label: 'joined time',
					},
					{
						label: 'invite status',
					},
					{
						label: 'latest balance totals',
					},
					{
						label: 'latest recovery state',
					},
					{
						label: 'latest sync time',
					},
					{
						label: 'timestamp count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest state',
					items: [
						{
							label: 'latest connected-client observation',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'timestamped connected-client observations',
						},
					],
				},
				{
					label: 'Federation',
					items: [
						{
							label: 'parent federation',
						},
					],
				},
				{
					label: 'Modules',
					items: [
						{
							label: 'moduleConfigJson for mint/wallet/Lightning/meta modules',
						},
					],
				},
				{
					label: 'Recovery/viewing keys',
					items: [
						{
							label: 'redacted local key material',
						},
					],
				},
				{
					label: 'Invite',
					items: [
						{
							label: 'invite code',
						},
						{
							label: 'federation id',
						},
						{
							label: 'preview/join status',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFedimintClientState>
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
	entityType={EntityType.BlockheadFedimintClientState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
