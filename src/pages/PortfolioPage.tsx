import { About } from '../components/About'
import { BeyondCoding } from '../components/BeyondCoding'
import { Connect } from '../components/Connect'
import { DynamicFavicon } from '../components/DynamicFavicon'
import { Education } from '../components/Education'
import { Experience } from '../components/Experience'
import { FloatingThemeToggle } from '../components/FloatingThemeToggle'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { PortfolioSkeleton } from '../components/PortfolioSkeleton'
import { Projects } from '../components/Projects'
import { ScrollProgress } from '../components/ScrollProgress'
import { TechStack } from '../components/TechStack'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { useTheme } from '../hooks/useTheme'

export function PortfolioPage() {
  const { theme, toggleTheme } = useTheme()
  const { content, loading } = usePortfolioContent()

  return (
    <div className="relative mx-auto min-h-screen max-w-6xl px-6 pb-16 pt-8 md:px-10 md:pb-24 md:pt-12">
      <DynamicFavicon href={content.profile.photoUrl} />
      <ScrollProgress />
      <FloatingThemeToggle theme={theme} onToggle={toggleTheme} />

      {loading ? (
        <PortfolioSkeleton />
      ) : (
        <>
          <Header profile={content.profile} />

          <main className="mt-20 flex flex-col gap-0 md:mt-28">
            <About paragraphs={content.about.paragraphs} />
            <Experience items={content.experience} />
            <Education education={content.education} />
            <TechStack techStack={content.techStack} />
            <BeyondCoding body={content.beyondCoding} />
            <Projects projects={content.projects} />
            <Connect profile={content.profile} links={content.connectLinks} />
          </main>

          <Footer />
        </>
      )}
    </div>
  )
}
