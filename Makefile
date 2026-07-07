.PHONY: run api-run fe-run build lint clean stop

run api-run fe-run build lint clean stop:
	pwsh -NoProfile run.ps1 $@
