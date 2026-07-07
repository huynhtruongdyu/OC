.PHONY: build run clean restore migration-add migration-apply

build:
	dotnet build

run:
	dotnet run --launch-profile https

clean:
	dotnet clean

restore:
	dotnet restore

migration-add:
	dotnet ef migrations add $(name) --project ../OC.Bootstrapper.Infrastructure --startup-project . --output-dir Persistence/Migrations

migration-apply:
	dotnet ef database update --project ../OC.Bootstrapper.Infrastructure --startup-project .
