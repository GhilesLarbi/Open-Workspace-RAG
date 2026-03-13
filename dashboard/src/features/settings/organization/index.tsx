import { ContentSection } from '../components/content-section'
import { OrganizationForm } from './organization-form'

export function SettingsOrganization() {
  return (
    <ContentSection
      title='Organization'
      desc='Manage your organization name and security settings.'
    >
      <OrganizationForm />
    </ContentSection>
  )
}