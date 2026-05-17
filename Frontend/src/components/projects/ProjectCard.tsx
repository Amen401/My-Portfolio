import React from "react";
import { Link } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";
import { IProject } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: IProject;
  view?: "grid" | "list";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  view = "grid",
}) => {
  const isGrid = view === "grid";

  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isGrid ? -5 : 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden shadow-none transition-all",
        isGrid ? "flex flex-col h-full" : "flex flex-col md:flex-row gap-6 p-4",
      )}
    >
      <div
        className={cn(
          "bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative rounded-md",
          isGrid ? "aspect-video" : "w-full md:w-64 h-48 md:h-auto shrink-0",
        )}
        id="project-card-image-container"
      >
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              project.status === "Completed"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : project.status === "In Progress"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            )}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div
        className={cn("flex flex-col flex-1", isGrid ? "p-5" : "py-2")}
        id="project-card-content"
      >
        <div
          className={cn("flex flex-col h-full", !isGrid && "justify-center")}
        >
          <h3
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-primary transition-colors"
            id="project-card-title"
          >
            {project.title}
          </h3>
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400 mb-4",
              isGrid ? "line-clamp-2" : "line-clamp-3",
            )}
            id="project-card-description"
          >
            {project.description}
          </p>

          <div
            className="flex flex-wrap gap-1.5 mb-6"
            id="project-card-techstack"
          >
            {project.techStack.map((tech, idx) => (
              <span
                key={`${tech}-${idx}`}
                className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          <div
            className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800"
            id="project-card-actions"
          >
            <Link
              to={`/projects/${project._id}`}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              View Details
            </Link>
            <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              <Link
                to={`/projects/${project._id}`}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
