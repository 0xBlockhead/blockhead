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
				label: 'asset instance',
			},
			'standard',
			{
				label: 'latest profile state',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'asset instance',
					},
					'standard',
					{
						label: 'latest RegulatedAssetProfile_Timestamp registry/control state',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'State observations',
					items: [
						{
							label: 'RegulatedAssetProfile_Timestamp list',
						},
					],
				},
				{
					label: 'Claim requirements',
					items: [
						{
							label: 'ClaimTopicRequirement list',
						},
					],
				},
				{
					label: 'Trusted issuers',
					items: [
						{
							label: 'TrustedIssuer list',
						},
					],
				},
				{
					label: 'Compliance modules',
					items: [
						{
							label: 'ComplianceModule list',
						},
					],
				},
				{
					label: 'Issuer powers',
					items: [
						{
							label: 'IssuerPower list',
						},
					],
				},
				{
					label: 'Restrictions',
					items: [
						{
							label: 'TransferRestriction list',
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
			selection: EntityProxyResource<typeof schema, EntityType.RegulatedAssetProfile>
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
	entityType={EntityType.RegulatedAssetProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
