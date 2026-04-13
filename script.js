// Dados dos funcionários (armazenados em localStorage)
let funcionarios = [];

// Carregar dados do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    atualizarTabela();
    atualizarStats();
    configurarFiltros();
    configurarBusca();
});

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

// Carregar dados do localStorage
function carregarDados() {
    const dados = localStorage.getItem('funcionarios');
    if (dados) {
        funcionarios = JSON.parse(dados);
    } else {
        // Dados de exemplo para demonstração
        funcionarios = [
            {
                id: 1,
                nome: 'Maria Silva',
                departamento: 'RH',
                diasDireito: 30,
                diasUsados: 15,
                dataInicio: '2025-01-15',
                dataFim: '2025-01-30',
                status: 'concluido',
                observacoes: 'Férias de inverno'
            },
            {
                id: 2,
                nome: 'João Santos',
                departamento: 'TI',
                diasDireito: 30,
                diasUsados: 0,
                dataInicio: '2025-02-01',
                dataFim: '2025-02-28',
                status: 'programado',
                observacoes: 'Férias programadas'
            },
            {
                id: 3,
                nome: 'Ana Costa',
                departamento: 'Marketing',
                diasDireito: 30,
                diasUsados: 10,
                dataInicio: '',
                dataFim: '',
                status: 'disponivel',
                observacoes: ''
            },
            {
                id: 4,
                nome: 'Pedro Oliveira',
                departamento: 'Financeiro',
                diasDireito: 30,
                diasUsados: 5,
                dataInicio: '2025-01-20',
                dataFim: '2025-02-05',
                status: 'em_ferias',
                observacoes: 'Em viagem'
            },
            {
                id: 5,
                nome: 'Carla Mendes',
                departamento: 'Vendas',
                diasDireito: 30,
                diasUsados: 0,
                dataInicio: '',
                dataFim: '',
                status: 'disponivel',
                observacoes: 'Disponível para agendar'
            }
        ];
        salvarDados();
    }
}

// Formulário
const form = document.getElementById('funcionarioForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('funcionarioId').value;
    const funcionario = {
        id: id ? parseInt(id) : Date.now(),
        nome: document.getElementById('nome').value,
        departamento: document.getElementById('departamento').value,
        diasDireito: parseInt(document.getElementById('diasDireito').value),
        diasUsados: parseInt(document.getElementById('diasUsados').value),
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        status: document.getElementById('status').value,
        observacoes: document.getElementById('observacoes').value
    };
    
    if (id) {
        // Editar existente
        const index = funcionarios.findIndex(f => f.id === parseInt(id));
        funcionarios[index] = funcionario;
    } else {
        // Adicionar novo
        funcionarios.push(funcionario);
    }
    
    salvarDados();
    atualizarTabela();
    atualizarStats();
    limparFormulario();
    alert('Funcionário salvo com sucesso!');
});

// Limpar formulário
function limparFormulario() {
    document.getElementById('funcionarioForm').reset();
    document.getElementById('funcionarioId').value = '';
}

// Atualizar tabela
function atualizarTabela(filtro = 'todos', busca = '') {
    const tbody = document.getElementById('funcionariosBody');
    tbody.innerHTML = '';
    
    let filtrados = funcionarios;
    
    // Aplicar filtro de status
    if (filtro !== 'todos') {
        filtrados = filtrados.filter(f => f.status === filtro);
    }
    
    // Aplicar busca
    if (busca) {
        const termo = busca.toLowerCase();
        filtrados = filtrados.filter(f => 
            f.nome.toLowerCase().includes(termo) || 
            f.departamento.toLowerCase().includes(termo)
        );
    }
    
    if (filtrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <p>Nenhum funcionário encontrado</p>
                </td>
            </tr>
        `;
        return;
    }
    
    filtrados.forEach(func => {
        const saldo = func.diasDireito - func.diasUsados;
        const periodo = func.dataInicio && func.dataFim 
            ? `${formatarData(func.dataInicio)} até ${formatarData(func.dataFim)}`
            : 'Não definido';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${func.nome}</strong></td>
            <td>${func.departamento}</td>
            <td>${func.diasDireito}</td>
            <td>${func.diasUsados}</td>
            <td class="${saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo'}">${saldo}</td>
            <td>${periodo}</td>
            <td><span class="status-badge status-${func.status}">${traduzirStatus(func.status)}</span></td>
            <td class="actions-cell">
                <button class="btn-edit" onclick="editarFuncionario(${func.id})">✏️ Editar</button>
                <button class="btn-danger" onclick="excluirFuncionario(${func.id})">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Formatar data
function formatarData(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Traduzir status
function traduzirStatus(status) {
    const traducoes = {
        'disponivel': 'Disponível',
        'programado': 'Programado',
        'em_ferias': 'Em Férias',
        'concluido': 'Concluído'
    };
    return traducoes[status] || status;
}

// Editar funcionário
function editarFuncionario(id) {
    const func = funcionarios.find(f => f.id === id);
    if (!func) return;
    
    document.getElementById('funcionarioId').value = func.id;
    document.getElementById('nome').value = func.nome;
    document.getElementById('departamento').value = func.departamento;
    document.getElementById('diasDireito').value = func.diasDireito;
    document.getElementById('diasUsados').value = func.diasUsados;
    document.getElementById('dataInicio').value = func.dataInicio || '';
    document.getElementById('dataFim').value = func.dataFim || '';
    document.getElementById('status').value = func.status;
    document.getElementById('observacoes').value = func.observacoes || '';
    
    // Scroll para o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Excluir funcionário
function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        funcionarios = funcionarios.filter(f => f.id !== id);
        salvarDados();
        atualizarTabela();
        atualizarStats();
    }
}

// Atualizar estatísticas
function atualizarStats() {
    const total = funcionarios.length;
    const emFerias = funcionarios.filter(f => f.status === 'em_ferias').length;
    const programadas = funcionarios.filter(f => f.status === 'programado').length;
    const disponiveis = funcionarios.filter(f => f.status === 'disponivel').length;
    
    document.getElementById('totalFuncionarios').textContent = total;
    document.getElementById('emFerias').textContent = emFerias;
    document.getElementById('programadas').textContent = programadas;
    document.getElementById('disponiveis').textContent = disponiveis;
}

// Configurar filtros
function configurarFiltros() {
    const botoes = document.querySelectorAll('.filter-btn');
    let filtroAtual = 'todos';
    
    botoes.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todos
            botoes.forEach(b => b.classList.remove('active'));
            // Adicionar classe active ao clicado
            this.classList.add('active');
            
            filtroAtual = this.dataset.filter;
            const busca = document.getElementById('searchInput').value;
            atualizarTabela(filtroAtual, busca);
        });
    });
}

// Configurar busca
function configurarBusca() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const filtroAtual = document.querySelector('.filter-btn.active').dataset.filter;
        atualizarTabela(filtroAtual, this.value);
    });
}
