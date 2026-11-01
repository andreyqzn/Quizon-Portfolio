import { About } from '../components/About'
import { BeyondCoding } from '../components/BeyondCoding'
import { Connect } from '../components/Connect'
import { Education } from '../components/Education'
import { Experience } from '../components/Experience'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Projects } from '../components/Projects'
import { TechStack } from '../components/TechStack'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { useTheme } from '../hooks/useTheme'

export function PortfolioPage() {
  const { theme, toggleTheme } = useTheme()
  const { content, loading } = usePortfolioContent()

  return (
    <div className="mx-auto min-h-screen bg-page px-4 py-8 md:max-w-[768px]">
      {loading ? (
        <p className="mb-3 text-xs text-muted">Loading content…</p>
      ) : null}
      <Header profile={content.profile} theme={theme} onToggleTheme={toggleTheme} />

      <main className="mt-6 grid grid-cols-1 gap-2.5 md:grid-cols-8">
        <About paragraphs={content.about.paragraphs} />
        <Experience items={content.experience} />
        <Education education={content.education} />
        <TechStack techStack={content.techStack} />
        <BeyondCoding body={content.beyondCoding} />
        <Projects projects={content.projects} />
        <Connect profile={content.profile} />
      </main>

      <Footer />
    </div>
  )
}
